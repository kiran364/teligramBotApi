const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); 

// App Config...
const app = express();  

//routes
const surveyRoute = require('./routes/survey.route');
app.use('/survey', surveyRoute)


// telegraf connection

const {Telegraf} = require('telegraf')

const bot = new Telegraf(process.env.botId)


bot.help((ctx)  => {
    ctx.reply("This Bot Perform Following Commands\n - /start\n - /help");
})

bot.start((ctx) => {
    let name = ctx.from.first_name
    ctx.reply(`Hi, ${name} Where are you from?`)}
)

bot.command('restart', (ctx) => {
    let name = ctx.from.first_name
    ctx.reply(`Hi, ${name} Where are you from?`)

})


bot.on('text', (ctx) => {
    console.log(ctx.message)
    ctx.reply(`How many vaccines are taken?`,{
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'One', callback_data: 'one' },
                ],
                [
                    { text: 'Two', callback_data: 'two' },
                ]
            ]
        }
    })
})

// 



bot.action('one', ctx => {
    console.log(ctx.match.input)
    let response = `Do you have any symptoms?`;
    ctx.deleteMessage();
    ctx.reply(response, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Yes", callback_data: 'yes' },
                ],
                [
                    { text: "No", callback_data: 'no' },
                ],
            ]
        }
    })
})


bot.action('yes', ctx => {
    console.log(ctx.match.input)
    let response = `Can I know which symptoms?`;
    ctx.deleteMessage();
    ctx.reply(response, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Cough", callback_data: 'cough' },
                ],
                [
                    { text: "Fever", callback_data: 'fever' },
                ],
            ]
        }
    })
})

bot.action('fever', ctx => {
    console.log(ctx.match.input)
    let response = `Take a calpol if fever increases contact to doctor`;
    ctx.deleteMessage();
    ctx.reply(response)
})

bot.action('cough', ctx => {
    console.log(ctx.match.input)
    let response = `Take a cofsils if cough increases contact to doctor`;
    ctx.deleteMessage();
    ctx.reply(response)
})

bot.action('no', ctx => {
    console.log(ctx.match.input)
    let response = `Congrats you are safe`;
    ctx.deleteMessage();
    ctx.reply(response)
})

bot.action('two', ctx => {
    console.log(ctx.match.input)
    let response = `Congrats you are full vaccinated! but fight is not over yet `;
    ctx.deleteMessage();
    ctx.reply(response)
})

bot.launch()
                 
const Port = process.env.Port || 5000;

// Middleware
app.use(express.json());

// DB Config
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then ( () => console.log("MongoDB Connected"))
.catch ( (err) => console.log(err));

//Default Route
app.get("/", (req, res) => {
    res.send("Hello From Teligram Boot API Server");
});


//Port for listening
app.listen(Port, () => {
    console.log(`Server Running On Port -- ${Port}`);
})

const { Client, GatewayIntentBits } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('@discordjs/builders');
const fetch = require('node-fetch');

// Initialize the client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Replace with your actual bot token
const DISCORD_BOT_TOKEN = "DISCORD_BOT_TOKEN"; // Replace with your actual bot token


const otherCrypto = {
  /*
  Big list of cryptocurrency names and symbols from @crypti (https://github.com/crypti/cryptocurrencies): 
  https://raw.githubusercontent.com/crypti/cryptocurrencies/refs/heads/master/cryptocurrencies.json
  */
  
}


const cryptoNames = {
  "BTC": "Bitcoin",
  "ETH": "Ethereum",
  "USDT": "Tether",
  "XRP": "Ripple",
  "BNB": "Binance Coin",
  "SOL": "Solana",
  "DOGE": "Dogecoin",
  "ADA": "Cardano",
  "TRX": "TRON",
  "AVAX": "Avalanche",
  "LINK": "Chainlink",
  "SUI": "Sui",
  "SHIB": "Shiba Inu",
  "XLM": "Stellar",
  "DOT": "Polkadot"
};
const popularCryptos = Object.keys(cryptoNames);

// Helper function to fetch cryptocurrency rates from Coinbase API
async function getCryptoRate(crypto, currency) {
    try {
        const url = `https://api.coinbase.com/v2/exchange-rates?currency=${crypto.toUpperCase()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data?.data?.rates?.[currency.toUpperCase()]) {
            return data.data.rates[currency.toUpperCase()];
        }
        return null;
    } catch (error) {
        console.error(`Error fetching data for ${crypto}:`, error);
        return null;
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Handle incoming messages
client.on('messageCreate', async (message) => {
    // Ignore bot messages or messages without the prefix
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'rates') {
        const cryptosArg = args[0]?.toUpperCase();
        const targetCurrency = args[1]?.toUpperCase();

        if (!cryptosArg || !targetCurrency) {
            message.channel.send(
                "\nPlease specify cryptocurrencies and a target currency.\nNeed help? Type ` !help ` for more information."
            );
            return;
        }

const cryptosToFetch = cryptosArg === "ALL" 
    ? popularCryptos 
    : [...new Set(cryptosArg.split(',').map(crypto => crypto.trim()))].slice(0, 10);

        try {
            let responseMessage = `Cryptocurrency prices in ${targetCurrency}:\n`;

            for (const crypto of cryptosToFetch) {
                if (cryptoNames[crypto]) {
                    const rate = await getCryptoRate(crypto, targetCurrency);
                    responseMessage += rate
                        ? `**${cryptoNames[crypto]} (${crypto})**: ${rate} ${targetCurrency}\n`
                        : `**${cryptoNames[crypto]} (${crypto})**: Rate not available\n`;
                } else if (otherCrypto[crypto]) {
                    const rate = await getCryptoRate(crypto, targetCurrency);
                    responseMessage += rate
                        ? `**${otherCrypto[crypto]} (${crypto})**: ${rate} ${targetCurrency}\n`
                        : `**${crypto}**: Rate not available\n`;
                } else {
                    responseMessage += `**${crypto}**: Rate not available\n`;
                }
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Price Predictions 📈')
                    .setStyle("Link")
                    .setURL('https://www.binance.com/en/price-prediction'),
                new ButtonBuilder()
                    .setLabel('Buy me a Ko-fi ❤️️')
                    .setStyle("Link")
                    .setURL('https://ko-fi.com/justachillguy'),
                new ButtonBuilder()
                    .setLabel("Invite me 🚀")
                    .setStyle("Link")
                    .setURL('https://discord.com/oauth2/authorize?client_id=1323386563316678738'),
                new ButtonBuilder()
                    .setLabel("Rate me on top.gg ⭐")
                    .setStyle("Link")
                    .setURL("https://top.gg/bot/1323386563316678738")
            );

            message.channel.send({ content: responseMessage, components: [row] });
        } catch (error) {
            console.error("Error fetching rates:", error);
            message.channel.send("An error occurred while fetching cryptocurrency rates. Please try again later.");
        }
    } else if (command === 'help') {
   
        message.channel.send(
    "**Help Menu**\n\n" +
    "Use the following commands to interact with this bot:\n\n" +
    "- ` !rates <CRYPTO(S)> <CURRENCY> `\n" +
    "   Get rates for specific cryptocurrencies. Example: ` !rates BTC,ETH USD ` (up to 10 coins).\n\n" +
    "- ` !rates all <CURRENCY> `\n" +
    "   Get rates for the top 15 cryptocurrencies. Example: ` !rates all EUR `.\n\n" +
    "- ` !help `\n" +
    "   Display this help menu.\n"
);
    } else {
        return;
    }
});

// Log in with your bot's token
client.login(DISCORD_BOT_TOKEN);



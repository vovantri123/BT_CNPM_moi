require('dotenv').config();
const mongoose = require('mongoose');

const dbState = [{
    value: 0,
    label: 'Disconnected'
},
{
    value: 1,
    label: 'Connected'
},
{    
    value: 2,
    label: 'Connecting'
},
{    
    value: 3,
    label: 'Disconnecting'
}]

const connection = async () => {
    await mongoose.connect(process.env.MONGO_DB_URI);
    const state = Number(mongoose.connection.readyState);
    console.log(`${dbState.find(e => e.value === state).label} to database ${mongoose.connection.name}`);
}   

module.exports = connection;
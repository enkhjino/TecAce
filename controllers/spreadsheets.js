const {google} = require('googleapis');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const keys = require('../keys.json');

module.exports = {
    read,
    create,
    delete:deleteIt
};

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

async function read(req, res){
    client.authorize(async function(err,tokens){
        if(err){
            console.log(err);
            return;
        }else{
            console.log('Connected!', req.query.spreadsheetId)
            const data = await gsread(client, req.query.spreadsheetId, req.query.range);
            console.log(data);
            res.json(data);
        }
    });
}


async function gsread(cl, sheetId, range){
    const gsa = google.sheets({version:'v4', auth: cl });
    const opt = {
        spreadsheetId:sheetId,
        range:range
    };

    let data = await gsa.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    return dataArray;
}

async function create(req, res){
    const doc = new GoogleSpreadsheet(req.body["spreadsheetId"]);
    await doc.useServiceAccountAuth({
    client_email: keys.client_email,
    private_key: keys.private_key,
    });

    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0]; 
    const larryRow = await sheet.addRow({ StudentName:req.body["studentName"], Gender: req.body["gender"]});
    res.json({result: 200, description:'OK'});
};

async function deleteIt(req,res){
    console.log('here')
    const doc = new GoogleSpreadsheet(req.body["spreadsheetId"]);
    await doc.useServiceAccountAuth({
    client_email: keys.client_email,
    private_key: keys.private_key,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows()
    console.log(rows)
    for(let i=0; i<rows.length; i++) {
        
        if(rows[i]['StudentName'] === req.body["studentName"]) {
        await rows[i].delete()
        }
    }
    res.json({result: 200, description:'OK'})
}




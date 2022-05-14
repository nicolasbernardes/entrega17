let express = require('express');
let app = express();
let PORT = process.env.PORT || 3000;
let AWS = require('aws-sdk');
let cors = require('cors');
// middleware
app.use(cors('*'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


AWS.connfig.update({
    region: 'us-east-1',
});


//SNS
const sns = new AWS.SNS();
const SNS_TOPIC_ARN = 'aws:sns:us-east-1:936701946992:reports';

//BD
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'estudantes';





app.get('/', (req, res) => {
    res.json({response:true});
    }
);

app.get('/info', (req, res) => {
    res.send(`escuchando el puerto ${PORT} , process.pid: ${process.pid} , NODE_ENV: ${process.env.NODE_ENV}`);
});

async function getUsers(params){
    try {
        let dynamoData = await dynamodb.scan(params).promise();
        let items = dynamoData.Items;
        while(dynamoData.LastEvaluatedKey){
            params.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
            dynamoData = await dynamodb.scan(params).promise();
            items.push(...dynamoData.Items);
        }
        return items;
    } catch (error) {
        console.log(error);
    }
}

app.get('/get_users', async(req, res) => {
    let params = {  
        tableName: tableName
    };
const users = await getUsers(params);

    res.json(users);
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
}
);



/* 
amazon 
ARN

arn:aws:sns:us-east-1:936701946992:reports

ARN
arn:aws:sns:us-east-1:936701946992:reports:997af623-ce10-4572-b965-be62cc0b5642
Endpoint
nicolas.beltrao69@gmail.com


*/
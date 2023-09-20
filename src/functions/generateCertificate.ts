import { APIGatewayProxyHandler } from "aws-lambda"

import { document } from "../utils/dynamodbClient"

interface ICreateCertificate {
    id: string;
    name: string;
    grade: string
}


export const handler: APIGatewayProxyHandler = async (event) => {
    // id, name, grade
    const { id, name, grade } = JSON.parse(event.body) as ICreateCertificate;
    
    await document
        .put({
            TableName: "users_certificate",
            Item: {
                id,
                name,
                grade,
                created_at: new Date().getTime(),
            }
    })
    

    const response = await document.query({
        TableName: "users_certificate",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    })
    
    return {
        statusCode: 201,
        body: JSON.stringify(response.Items[0]),
    };
};
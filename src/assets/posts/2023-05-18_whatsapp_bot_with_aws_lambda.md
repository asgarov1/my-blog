# Whatsapp Bot with AWS Lambda

---

I always liked the idea of automating something by using whatsapp. And the fact that we don't need a backend hosted and can
simply use serverless function (AWS Lambda) is great as well. One of the benefits of serverless functions is that at low
number of invocations they are free (I think something like under 1000 a month won't get you billed at all) so ideal for 
private projects cause even smallest EC2 instance ends up costing around 5 USD a month, and next size lands you around 30 bucks.

## Part 1: AWS Lambda Configuration

1. Go to AWS Console -> [AWS Lambda](https://us-east-1.console.aws.amazon.com/)
2. Press "Create function"
3. Enter function name and choose runtime of python (or some other language, but I'm going to be using python :)
4. Create function by pressing the corresponding button ("Create function")

Now that you are in a dashboard showing your new function, paste the following code inside. Most of it is the boilerplate
code to help whatsapp verify the security stuff and the custom logic goes into `handle_post`.

```python
import json
from datetime import datetime, timedelta
from urllib.parse import urlencode
from urllib.request import Request, urlopen


# Http Statuses
OK = 200
FORBIDDEN = 403
BAD_REQUEST = 400
VERIFY_TOKEN = 'fooBar'
WHATSAPP_TOKEN = ''


def create_response(body, status_code=OK):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body)
    }


def handle_get(event):
    """
    https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
    to learn more about GET request for webhook verification
    :param event:
    :return:
    """
    query_parameters = event.get('queryStringParameters')
    if query_parameters is not None:
        hub_mode = query_parameters.get('hub.mode')
        if hub_mode == 'subscribe':
            return handle_subscribe_mode(query_parameters)
        else:
            return create_response('Error, wrong mode', FORBIDDEN)

    return create_response('Error, no query parameters', BAD_REQUEST)


def handle_subscribe_mode(query_parameters):
    verify_token = query_parameters.get('hub.verify_token')
    if verify_token == VERIFY_TOKEN:
        challenge = query_parameters.get('hub.challenge')
        return create_response(int(challenge))
    else:
        return create_response('Error, wrong validation token', FORBIDDEN)


def create_whatsapp_response_json(recipient, message_body):
    return {
        "messaging_product": "whatsapp",
        "to": recipient,
        "text": {"body": message_body},
    }


def send_reply(phone_number_id, whatsapp_token, message_from, reply_message):
    path = "https://graph.facebook.com/v12.0/"+phone_number_id+"/messages?access_token="+whatsapp_token
    message = create_whatsapp_response_json(message_from, reply_message)

    request = Request(path, urlencode(message).encode())
    json_response = urlopen(request).read().decode()
    print('Sent reply to whatsapp with the following response: ' + str(json_response))



def handle_post(event):
    # body is a valid dict sent as string, so we need to convert it to dict
    body = json.loads(event.get('body'))

    for entry in body.get('entry', {}):
        for change in entry.get('changes'):
            value = change.get('value', {})
            messages = value.get('messages')
            for message in messages:
                message_time = datetime.fromtimestamp(int(message.get('timestamp')))
                # only process messages of type text and received in last 3 seconds
                if message.get('type') == 'text' and message_time > datetime.utcnow() - timedelta(seconds=3):
                    phone_number_id = value.get('metadata', {}).get('phone_number_id')
                    message_from = message.get('from')
                    message_body = message.get('text').get('body')

                    reply = f'Received on {datetime.utcnow().strftime("%B %d %Y - %H:%M:%S")}\n' \
                            f'"{message_body}"\n\nYou can now implement your custom logic to be done upon receiving this message here'

                    ###                                                                       ###
                    # whatever you might like to do upon receiving a whatsapp message goes here #
                    ###                                                                       ###
                    
                    send_reply(phone_number_id, WHATSAPP_TOKEN, message_from, reply)

                return create_response('Done')


######################
# Lambda Entry Point #
######################
def lambda_handler(event, context):
    http_method = event.get('requestContext', {}).get('http', {}).get('method')
    if http_method == 'GET':
        return handle_get(event)
    elif http_method == 'POST':
        return handle_post(event)
    else:
        return create_response('Unsupported method', BAD_REQUEST)
```

We will fill in the `WHATSAPP_TOKEN` a bit later. Naturally you shouldn't be hardcoding any token values into your code,
and instead set it up as environment variable as shown [here](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)
and then reference it in code with:
```python
import os
#...
WHATSAPP_TOKEN = os.environ['WHATSAPP_TOKEN']
```

Last but not least, go to Configuration panel and press "Create function URL". We will be using this URL for Whatsapp.

## Part 2: Whatsapp Configuration

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps/?show_reminder=true&locale=en_US)
2. Click "Create App"
3. When asked "Which use case do you want to add to your app?" select "Other"
4. When asked "Select an app type" -> select "Business" (only business apps get whatsapp available)
5. Fill out rest of the forms and press "Create app"
6. Choose WhatsApp (Integrate with WhatsApp) option
7. Go to Getting Started
8. Copy the Temporary access token
9. paste it as a value in AWS Lambda for `WHATSAPP_TOKEN` (don't forget to redeploy code)
10. Back in developers.facebook.com -> Go to Configuration -> Edit
11. Paste the URL that we created in the previous part ("Create function URL")
12. For Verify token enter the value defined in our code `fooBar`
13. Press "Verify and save" and et voila!

Now send a message to the whatsapp test number you can see and you will get the response from AWS Lambda.

# Part 3: Generating permanent API Access Token

1. Go to [business.facebook.com/settings/system-users](https://business.facebook.com/settings/system-users/)
2. Click "Add assets"(or sth similar - in German "Assets Hinzufügen")
3. Go to Apps and add you App with all the options
4. Generate new Key, select "Token expiration" as "Never" and make sure to check "whatsapp_business_messaging" checkbox
5. Copy the newly generated key into our code as a new value for `WHATSAPP_TOKEN` (don't forget to redeploy code)

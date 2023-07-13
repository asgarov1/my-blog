# AWS Cookbook

---

### Prerequisites

installed and configured AWS SDK
```bash
sudo apt install python3-pip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws configure
```
---

## GET voice over with Amazon Polly
See also [documentation](https://docs.aws.amazon.com/de_de/polly/latest/dg/managing-lexicons.html)
```python
# This example shows regional isolation of data

import boto3
polly = boto3.client('polly',region_name="eu-west-2")
result = polly.synthesize_speech(Text='This is Amazon Polly - HW!',
                                 OutputFormat='mp3',
                                 VoiceId='Aditi',
                                 LexiconNames=["awsLexicon"])

# Read the bytes from the Audio Stream in the response
audio = result['AudioStream'].read()

with open("helloaws.mp3","wb") as file:
  file.write(audio)
```

### Choose different voice
*You can replace the voice by setting a different `VoiceId`, which you can list with the command
`aws polly describe-voices --language en-US --output table`*

### Upload custom lexicon
- Create a custom lexicon file where you can specify you custom abbreviations:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<lexicon version="1.0" 
      xmlns="http://www.w3.org/2005/01/pronunciation-lexicon"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xsi:schemaLocation="http://www.w3.org/2005/01/pronunciation-lexicon 
        http://www.w3.org/TR/2007/CR-pronunciation-lexicon-20071212/pls.xsd"
      alphabet="ipa" 
      xml:lang="en-US">
  <lexeme>
    <grapheme>HW</grapheme>
    <alias>Hello World</alias>
  </lexeme>
</lexicon>
```
- Upload it (to your default region) with: `aws polly put-lexicon --name awsLexicon --content file://YOUR_FILE.xml`
---

## EC2

### get metadata of the EC2 instance from within the instance
- `curl http://169.254.169.254/latest/meta-data/`
returns a list of metadata links like:
```
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
events/
hostname
identity-credentials/
instance-action
instance-id
instance-life-cycle
instance-type
local-hostname
local-ipv4
mac
managed-ssh-keys/
metrics/
network/
placement/
profile
public-hostname
public-ipv4
public-keys/
reservation-id
security-groups
services/
```

e.g. get public ip of the instance `curl http://169.254.169.254/latest/meta-data/public-ipv4`

## Helpful commands:
- GET current region: `aws configure get region`



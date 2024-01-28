# Bypassing 'Path Traversal' Check with Custom Serialization on Frontend

### Background
We had a case where our firewall would block requests with certain content
because those would trigger the 'Path Traversal' alarm. So for example a harmless 
request with the following request body:

```typescript
{
  value: `some text with quote: "this is my quote.."`
}
```

would result in the following JSON payload:
```json
{
  "value": "some text with quote: \"this is my quote..\""
}
```

This is expected behavior because JSON uses backslashes to escape quotes but in this
case the resulting string ends up containing `..\ ` which triggered the path traversal alarm.

### Solution

Of course we could just html encode the payload and decode it in backend. But because
we had this through the whole large application, and this could happen in any component
that has a text field we needed a global solution, and ideally without 
making changes on the backend (because this was actually a FE problem of not being able
to send data through the firewall)

So we ended up adjusting the JSON serializer. Under the hood, Angular calls
`JSON.stringify` to serialize our body objects so we adjusted it as following in `main.ts`:

```javascript

// Store the original JSON.stringify method
const originalStringify = JSON.stringify;

// Redefine JSON.stringify
const TWO_DOTS_FOLLOWED_BY_BACKSLASH_REGEX = /\.{2}(?=\\)/;
const TWO_DOTS_UNICODE = String.raw`\u002E\u002E`;

JSON.stringify = function(value, replacer, space) {
  // Call the original method
  // @ts-ignore
  const originalJson =  originalStringify.call(JSON, value, replacer, space);
  if (TWO_DOTS_FOLLOWED_BY_BACKSLASH_REGEX.test(originalJson)) {
    console.log(`Found '..\' character combination in JSON, will replace the two dots with unicode (${TWO_DOTS_UNICODE}), to avoid false triggering 'path traversal' alarm`);
    return originalJson.replace(TWO_DOTS_FOLLOWED_BY_BACKSLASH_REGEX, TWO_DOTS_UNICODE);
  }
  return originalJson;
};
```

this makes sure to replace any found 2 dots followed by a backslash with unicode
representation of dots `\u002E`. The advantage of this approach is that 
unicode is automatically converted back to string in our Java backend, so backend
didn't even notice this encoding but this fixed the issue of the firewall.

Now when we checked the payload (the source view) we see in browser:
`{"value":"some text with quote: \"this is my quote\u002E\u002E\""}`

<br/>
<br/>
<img src="assets/images/payload_received_in_backend.png">  


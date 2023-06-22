# A Gossip of Mermaids

Render mermaid.js diagrams right inside your chromium based browser with this extension.

## Installation instruction

Step 1. Clone this repo on your local machine.

Step 2. Enable chrome extension developer mode.

![Enable dev mode](docs/demo-dev-mode.png "Enable dev mode")

Step 3. Load extension by clicking "Load unpacked" and locating the repo.

![Load extension](docs/demo-load-extension.jpg "Load extension")

Step 4. Refresh any confluence page with a code-block with `#!mermaid` identifier and a diagram should appear.

## Drawing a diagram

Go to https://mermaid.live/ to design your diagram.

Paste the content in a new code-block and start with the following tag - 

```
#!mermaid (Render: https://github.com/shafayet-bk/a-gossip-of-mermaids)
```

Example:

```
#!mermaid (Render: https://github.com/shafayet-bk/a-gossip-of-mermaids)
flowchart TD
  s1(["getValue(key)"])
  s2{"check if key exists on redis"}
  s3("return value from redis")
  s4("acquire lock: INIT_REDIS_VALUE_SETTER")
  s5("get value from dynamodb (null accepted)")
  s6("set value on redis")
  s7("release lock: INIT_REDIS_VALUE_SETTER")
  s8("return value")
  s1 --> s2
  s2 --yes--> s3
  s2 --no--> s4
  s4 --> s5 --> s6 --> s7 --> s8
```

Note: the `(Render: https://github.com/shafayet-bk/a-gossip-of-mermaids)` part is optional but is highly recommended since it helps viewer to get to this page.

## Known caveats

You will need to escape HTML entities in your quoted text (as in, the less than or greater than signs.)

## License

Currently, all rights reserved. To be used by bKash labs team for internal development.


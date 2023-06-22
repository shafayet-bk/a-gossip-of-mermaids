const writeLog = (...argList) => {
  console.debug("AGOM:", ...argList);
};

writeLog("Processor script loaded.");

const INTERVAL = 4_000;

writeLog("mermaid", mermaid);
mermaid.initialize({
  startOnLoad: true, securityLevel: 'loose',
});

const pollingAgentFn = async () => {
  writeLog("Polling Started...")
  try {
    let isEditing = !!document.querySelector("#publish-button");
    if (isEditing) {
      writeLog("The page is in edit mode. Aborting this session.");
      setTimeout(pollingAgentFn, INTERVAL);
      return;
    }

    document.querySelectorAll("div.code-block").forEach(confluenceCodeBlockEl => {
      if (confluenceCodeBlockEl.className.includes("agom-processed")) {
        writeLog("Already processed this code block. Skipping.");
        return;
      }
      confluenceCodeBlockEl.classList.add("agom-processed");

      let text = (confluenceCodeBlockEl.innerText || "").trim();
      if (text.indexOf("#!mermaid") !== 0) {
        writeLog("Not a mermaid code block. Skipping.");
        return;
      }

      text = text.split("\n");
      text.shift();
      text = text.join("\n").trim();
      text = text.replace(/\n\n/g, "\n");

      writeLog(`Injecting new pre block. Final Text: |${JSON.stringify(text)}|`);

      let preEl = document.createElement("pre");
      preEl.classList.add("agom-mermaid");
      preEl.innerHTML = text;

      confluenceCodeBlockEl.parentNode.insertBefore(preEl, confluenceCodeBlockEl.nextSibling);
    });

    writeLog("Invoking mermaid.run");
    await mermaid.run({
      querySelector: '.agom-mermaid',
    });
    writeLog("mermaid.run finished.");

  } catch (ex) {
    console.error(ex);
  }

  setTimeout(pollingAgentFn, INTERVAL);
}

pollingAgentFn();


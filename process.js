const writeLog = (...argList) => {
  console.log("AGOM:", ...argList);
};

writeLog("Processor script loaded.");

const INTERVAL = 10_000;

writeLog("mermaid", mermaid);
mermaid.initialize({
  startOnLoad: true, securityLevel: 'loose',
});

const pollingAgentFn = async () => {
  writeLog("Polling Started...")
  try {
    document.querySelectorAll("div.code-block").forEach(confluenceCodeBlockEl => {
      if (confluenceCodeBlockEl.className.includes("agom-processed")) {
        writeLog("Already processed code block.");
        return;
      }
      confluenceCodeBlockEl.classList.add("agom-processed");

      let text = (confluenceCodeBlockEl.innerText || "").trim();
      if (text.indexOf("#!mermaid") !== 0) {
        writeLog("Not mermaid code block.");
        return;
      }

      text = text.replace("#!mermaid", "").trim();
      text = text.replace(/\n\n/g, "\n");

      writeLog(`Final Text: |${JSON.stringify(text)}|`);

      let preEl = document.createElement("pre");
      preEl.classList.add("agom-mermaid");
      preEl.innerHTML = text;

      confluenceCodeBlockEl.parentNode.insertBefore(preEl, confluenceCodeBlockEl.nextSibling);
    });

    await mermaid.run({
      querySelector: '.agom-mermaid',
    });

  } catch (ex) {
    console.error(ex);
  }

  setTimeout(pollingAgentFn, INTERVAL);
}

pollingAgentFn();


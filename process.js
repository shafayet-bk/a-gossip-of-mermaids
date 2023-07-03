const writeLog = (...argList) => {
  console.debug("AGOM:", ...argList);
};

writeLog("Processor script loaded.");

const INTERVAL = 4_000;

writeLog("mermaid", mermaid);
mermaid.initialize({
  startOnLoad: true, securityLevel: 'loose',
});

let popEl = document.createElement("div");
popEl.style.minWidth = "calc(100vw - 8px - 8px)";
popEl.style.minHeight = "calc(100vh - 8px - 8px)";
popEl.style.backgroundColor = "#e5e3ef";
popEl.style.position = "fixed";
popEl.style.left = "0px";
popEl.style.top = "0px";
popEl.style.zIndex = "9999";
popEl.style.display = "none";
popEl.style.padding = "8px";
document.body.appendChild(popEl);

let popButtonContainerEl = document.createElement("div");
popButtonContainerEl.style.textAlign = "right";
popEl.appendChild(popButtonContainerEl);

let popButtonEl = document.createElement("button");
popButtonEl.innerHTML = "Close";
popButtonEl.style.margin = "8px";
popButtonEl.style.cursor = "pointer";
popButtonEl.style.height = "22px";
popButtonEl.addEventListener("click", (e) => {
  popEl.style.display = "none";
  document.body.style.overflow = "auto";
});
popButtonContainerEl.appendChild(popButtonEl);

let popInnerEl = document.createElement("div");
popInnerEl.style.height = "calc(100vh - 8px - 8px - 22px - 8px)";
popInnerEl.style.width = "calc(100vw - 8px - 8px - 0px - 8px)";
popInnerEl.style.overflow = "scroll";
popEl.appendChild(popInnerEl);

const clickListener = (e) => {
  let node = e.target;
  while (node.nodeName !== "svg") {
    node = node.parentNode;
  }
  writeLog("Clicked on node:", node);

  popInnerEl.innerHTML = "";
  let nodeClone = node.cloneNode(true);

  popInnerEl.appendChild(nodeClone);

  let rect = node.getBoundingClientRect();
  if (rect.width > rect.height) {
    nodeClone.setAttribute("height", "100%");
    nodeClone.removeAttribute("width");
  } else {
    nodeClone.setAttribute("width", "100%");
    nodeClone.removeAttribute("height");
  }

  document.body.style.overflow = "hidden";
  popEl.style.display = "block";
}


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
      confluenceCodeBlockEl.querySelector('code').style.maxHeight = "300px";
      confluenceCodeBlockEl.style.marginBottom = "12px";

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
      preEl.style.marginTop = "12px";
      preEl.style.cursor = "pointer";

      confluenceCodeBlockEl.parentNode.insertBefore(preEl, confluenceCodeBlockEl);

      let headerEl = document.createElement("div");
      headerEl.innerText = "(Auto-generated diagram. Click to zoom.)";
      headerEl.style.fontSize = "12px";
      headerEl.style.textAlign = "center";
      confluenceCodeBlockEl.parentNode.insertBefore(headerEl, confluenceCodeBlockEl);

    });

    writeLog("Invoking mermaid.run");
    await mermaid.run({
      querySelector: '.agom-mermaid',
    });
    writeLog("mermaid.run finished.");

    document.querySelectorAll('.agom-mermaid').forEach(pre => {
      pre.removeEventListener("click", clickListener);
      pre.addEventListener("click", clickListener);
    });

  } catch (ex) {
    console.error(ex);
  }

  setTimeout(pollingAgentFn, INTERVAL);
}

pollingAgentFn();


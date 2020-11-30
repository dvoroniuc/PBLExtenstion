chrome.runtime.onMessage.addListener(newMessage);

function newMessage(message, sender, sendResponse) {
  const reg = new RegExp(message, "gi");

  const matched = document.querySelectorAll(`input[value=${message}]`);

  [...matched].map((a) => {
    console.log(a);
    a.style.border = "thick solid red";
  });
  // document.querySelectorAll(`*`).forEach((node) => {
  //   if (node.nodeName === "INPUT") {
  //     console.log(
  //       String(node.value)
  //         .replace(/(\r\n|\n|\r)/gm, "")
  //         .replace(/\s+/g, " ")
  //         .replace("\t", "")
  //         .trim()
  //     );
  //   }
  //   if (node.nodeName === "DIV" || "P") {
  //     console.log(
  //       String(node.textContent)
  //         .replace(/(\r\n|\n|\r)/gm, "")
  //         .replace(/\s+/g, " ")
  //         .replace("\t", "")
  //         .trim()
  //     );
  //   }
  //   if (node.nodeName === "A") {
  //     console.log(
  //       String(node.text)
  //         .replace(/(\r\n|\n|\r)/gm, "")
  //         .replace(/\s+/g, " ")
  //         .replace("\t", "")
  //         .trim()
  //     );
  //   }
  // });
}

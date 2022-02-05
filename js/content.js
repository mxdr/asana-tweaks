async function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}


async function loadOptions() {
  chrome.storage.sync.get("enabledOptions", (data) => {
    let enabledOptions = data.enabledOptions || []

    for (let enabledOption of enabledOptions) {
      console.log('enabledOption', enabledOption)
      document.body.classList.add("tweak-" + enabledOption);
    }
  })
}

docReady(async function () {
  await loadOptions()
})

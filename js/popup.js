async function docReady(fn) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(fn, 1)
  } else {
    document.addEventListener("DOMContentLoaded", fn)
  }
}

async function handleChange(event) {
  const option = event.target.dataset.option
  let enabledOptions = await chrome.storage.sync.get("enabledOptions").enabledOptions || []

  if (event.target.checked) enabledOptions.push(option)
  else enabledOptions.pop(option)

  chrome.storage.sync.set({ enabledOptions })
}

docReady(async function () {
  chrome.storage.sync.get("enabledOptions", (data) => {
    for (let toggle of document.getElementsByClassName("switch")) {
      toggle.addEventListener("change", handleChange)
      let enabledOptions = data.enabledOptions

      if (!enabledOptions) {
        enabledOptions = []
        chrome.storage.sync.set({ enabledOptions })
        break
      }

      let checkbox = toggle.firstElementChild
      let option = checkbox.dataset.option

      if (enabledOptions.includes(option)) {
        toggle.classList.add("notransition")
        checkbox.checked = true
        checkbox.offsetHeight
        toggle.classList.remove("notransition")
      }
    }
  })
})

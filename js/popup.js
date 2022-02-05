async function docReady(fn) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(fn, 1)
  } else {
    document.addEventListener("DOMContentLoaded", fn)
  }
}

async function getAsanaTabs() {
  tabs = await chrome.tabs.query({})
  if (!tabs) return []

  console.log('tabs1', tabs)

  let returnTabs = []

  for (let tab of tabs) {
    let url = new URL(tab.url)
    if (url.hostname == "app.asana.com") returnTabs.push(tab)
  }

  return returnTabs
}

async function toggleAsanaClass(value, option) {
  if (value == 'on') func = (option) => document.body.classList.add(`tweak-${option}`)
  else func = (option) => document.body.classList.remove(`tweak-${option}`)

  let tabs = await getAsanaTabs()

  console.log('tabs', tabs)

  for (let tab of tabs) chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func,
    args: [ option ],
  })
}

async function handleChange(event) {
  let enabledOptions = await chrome.storage.sync.get("enabledOptions").enabledOptions || []
  const option = event.target.dataset.option

  if (event.target.checked) {
    enabledOptions.push(option)
    toggleAsanaClass('on', option)
  } else {
    enabledOptions.pop(option)
    toggleAsanaClass('off', option)
  }

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

      console.log('enabledOptions', enabledOptions)

      if (enabledOptions.includes(option)) {
        toggle.classList.add("notransition")
        checkbox.checked = true
        checkbox.offsetHeight
        toggle.classList.remove("notransition")
      }
    }
  })
})

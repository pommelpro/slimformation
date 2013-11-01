All development should be done in slimfo/src/common. Everything else
is part of the kango framework.

DEBUGGING TIPS

In Chrome, in the Extensions view, load the extension with the
"Load unpacked extension ..." button, and specify the output/chrome directory.

See also http://stackoverflow.com/questions/3829150/google-chrome-extension-console-log-from-background-page/3830956#3830956

For info on:

    chrome.extension.getBackgroundPage().console.log('foo');

--

In Chrome, you can see logs for the background script by clicking the
"Inspect views: background.html" link in the Extensions view.


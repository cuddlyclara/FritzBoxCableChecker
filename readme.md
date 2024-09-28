# FritzBox Cable Checker

This is a Tampermonkey script designed to analyze values on the "Kabel-Informationen" page of a FritzBox. It highlights important values based on the guidelines from [this source](https://debiandev.de/wp-content/uploads/2021/02/Bild-4.png). Currently, this only checks the values of the download stream.

## Installation

To install the script, simply copy the contents of `script.js` from this repository into your Tampermonkey plugin. You can adjust the URL of your FritzBox in the `@match` section of the script header (the default URL is `http://fritz.box/*`).

## Screenshot

![FritzBox Cable Checker Screenshot](https://github.com/user-attachments/assets/f98d6b88-81e8-4c4f-bca3-a7539bdba167)
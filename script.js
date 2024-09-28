// ==UserScript==
// @name         FritzBox Cable Checker
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Checks the data displayed on the "Kabel-Informationen" page of a Cable FritzBox.
// @author       cuddlyclara
// @match        http://fritz.box/*
// @icon         https://www.google.com/s2/favicons?domain=avm.de
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    // Object to store the modem limits
    // Source: https://debiandev.de/wp-content/uploads/2021/02/Bild-4.png
    const limits = {
        "Docsis31Ds": {
            "1024QAM": {
                "power": {
                    "good": {
                        "max": 20.0,
                        "min": -3.9
                    },
                    "bad": {
                        "max": 22.0,
                        "min": -5.9
                    }
                },
                "snr": {
                    "good": {
                        "min": 38.1
                    },
                    "bad": {
                        "min": 36.1
                    }
                }
            },
            "2048QAM": {
                "power": {
                    "good": {
                        "max": 22.0,
                        "min": -1.9
                    },
                    "bad": {
                        "max": 22.0,
                        "min": -3.9
                    }
                },
                "snr": {
                    "good": {
                        "min": 41.1
                    },
                    "bad": {
                        "min": 39.1
                    }
                }
            },
            "4096QAM": {
                "power": {
                    "good": {
                        "max": 24.0,
                        "min": 0.1
                    },
                    "bad": {
                        "max": 26.0,
                        "min": -1.9
                    }
                },
                "snr": {
                    "good": {
                        "min": 44.1
                    },
                    "bad": {
                        "min": 42.1
                    }
                }
            }
        },
        "Docsis30Ds": {
            "64QAM": {
                "power": {
                    "good": {
                        "max": 12.0,
                        "min": -11.9
                    },
                    "bad": {
                        "max": 14.0,
                        "min": -13.9
                    }
                },
                "snr": {
                    "good": {
                        "min": 26.1
                    },
                    "bad": {
                        "min": 24.1
                    }
                }
            },
            "256QAM": {
                "power": {
                    "good": {
                        "max": 18.0,
                        "min": -5.9
                    },
                    "bad": {
                        "max": 20.0,
                        "min": -7.9
                    }
                },
                "snr": {
                    "good": {
                        "min": 32.1
                    },
                    "bad": {
                        "min": 30.1
                    }
                }
            }
        },
    };

    // Variable to store the previous URL hash
    let previousHash = window.location.hash;

    // Function to check specific modem value
    function checkValue(docsis, modulation, type, value) {
        // Convert value string to number
        value = parseFloat(value);
        if (typeof value !== "number" || isNaN(value)) {
            return undefined;
        }

        // Check power
        if (type == "power") {
            let powerLimit = limits[docsis][modulation].power;

            if (value >= powerLimit.good.min && value <= powerLimit.good.max) {
                return "green";
            }
            else if (value >= powerLimit.bad.min && value <= powerLimit.bad.max) {
                return "orange";
            }
            else {
                return "red";
            }
        }
        // Check snr
        else if (type == "snr") {
            let snrLimit = limits[docsis][modulation].snr;

            if (Math.abs(value) >= snrLimit.good.min) {
                return "green";
            }
            else if (Math.abs(value) >= snrLimit.bad.min) {
                return "orange";
            }
            else {
                return "red";
            }
        }
    }

    // Function to check the hash change to "#docInfo"
    function checkHash() {
        if (window.location.hash === "#docInfo" && previousHash !== "#docInfo") {
            previousHash = window.location.hash; // Update previousHash after hash change to "#docInfo" to ensure the check runs only once
            console.log("FritzBox Cable Checker is now checking...");

            // Check Docsis31Ds
            {
                let modulation = document.querySelectorAll("#uiDocsis31Ds [role='cell'][prefid='modulation']");
                let snr = document.querySelectorAll("#uiDocsis31Ds [role='cell'][prefid='mer']");
                let power = document.querySelectorAll("#uiDocsis31Ds [role='cell'][prefid='powerLevel']");

                for (let i = 0; i < modulation.length; i++) {
                    // Check power and snr
                    let powerResult = checkValue("Docsis31Ds", modulation[i].textContent, "power", power[i].textContent);
                    let snrResult = checkValue("Docsis31Ds", modulation[i].textContent, "snr", snr[i].textContent);

                    // Set color for power
                    if (powerResult) {
                        power[i].style.color = powerResult;
                    }

                    // Set color for snr
                    if (snrResult) {
                        snr[i].style.color = snrResult;
                    }
                }
            }

            // Check Docsis30Ds
            {
                let modulation = document.querySelectorAll("#uiDocsis30Ds [role='cell'][prefid='modulation']");
                let snr = document.querySelectorAll("#uiDocsis30Ds [role='cell'][prefid='mse']");
                let power = document.querySelectorAll("#uiDocsis30Ds [role='cell'][prefid='powerLevel']");

                for (let i = 0; i < modulation.length; i++) {
                    // Check power and snr
                    let powerResult = checkValue("Docsis30Ds", modulation[i].textContent, "power", power[i].textContent);
                    let snrResult = checkValue("Docsis30Ds", modulation[i].textContent, "snr", snr[i].textContent);

                    // Set color for power
                    if (powerResult) {
                        power[i].style.color = powerResult;
                    }

                    // Set color for snr
                    if (snrResult) {
                        snr[i].style.color = snrResult;
                    }
                }
            }
        }
        else if (window.location.hash !== "#docInfo" && previousHash === "#docInfo") {
            previousHash = window.location.hash; // Update previousHash after leaving the "#docInfo" page to reenable check
        }
    }

    // Check periodically for hash changes because the hashchange event is not working
    setInterval(checkHash, 1000);
})();
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v4/ODataModel"
], (Controller, MessageBox, ODataModel) => {
    "use strict";

    return Controller.extend("kalenderui.controller.Login", {
        
        onInit: function () {},

        onLogin: async function () {
            const oView = this.getView();
            const sUsername = oView.byId("usernameInput").getValue();
            const sPassword = oView.byId("passwordInput").getValue();

            try {
                const response = await fetch("/odata/v4/kalender/validateLogin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: sUsername,
                        password: sPassword
                    })
                });

                const result = await response.json();

                if (!response.ok || !result.accessToken || !result.refreshToken) {
                    MessageBox.error("Invalid username or password.");
                    return;
                }
                
                localStorage.setItem("accessToken", result.accessToken);
                localStorage.setItem("refreshToken", result.refreshToken);

                // Set timeout function will be removed and fix the bug where the tokens stay in session even if cleared or try to be cleared
                setTimeout(() => {
                    const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("calender");
                }, 1000);

            } catch (err) {
                console.error("Error during login:", err);
                MessageBox.error("An error occurred during login. Please try again later.");
            }
        }
    });
});

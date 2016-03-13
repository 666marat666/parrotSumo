import QtQuick 2.0
import QtQuick.Window 2.2
import QtWebKit 3.0

Rectangle {
    id: root
    property int margin: 0
    property int batteryPercent: 100
    function setBatteryValue(percent) {
        batteryPercent = percent;
    }

    onBatteryPercentChanged: battery.setValue(batteryPercent);
    color: "#EEEEEE"
    anchors.top: parent.top
    anchors.topMargin: margin

    function setSwitch(itemName, status) {
        var length = grid.children.length
        for(var i = 0; i < length ; i++) {
            if (grid.children[i].roomName == itemName) {
                grid.children[i].changeSwitch(status);
            }
        }
    }

    function drawPic(blob) {
        canvas.createImage2(data);
    }

    WebView {
        id: webview

        url: "http://localhost/codeCamp/index.html"
        anchors.fill: parent
        onNavigationRequested: {
            // detect URL scheme prefix, most likely an external link
            var schemaRE = /^\w+:/;
            if (schemaRE.test(request.url)) {
                request.action = WebView.AcceptRequest;
            } else {
                request.action = WebView.IgnoreRequest;
                // delegate request.url here
            }
        }
    }


    function sendToSocket(text) {
        socket.sendTextMessage(text);
    }

    Flickable {
        interactive: true
        anchors.fill: root
        contentHeight: root.height
        contentWidth: root.width

        Battery {
            id: battery;
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.topMargin: 20
            anchors.rightMargin: 20
            width: 40;
            height: 75;
        }

        Grid {
            id: buttonAction
            anchors.bottom: parent.bottom
            anchors.bottomMargin: 20
            columns: 10
            spacing: 5
            MaterialButton {
                buttonText: "LongJump"; width: 150; height: 35;
                MouseArea{
                    anchors.fill: parent;
                    onClicked :{
                        console.log(parent.buttonText);
                        onClicked :{
                            sendToSocket(JSON.stringify(["action", parent.buttonText]));
                        }
                    }
                }
            }
            MaterialButton {
                buttonText: "HighJump"; width: 150; height: 35;
                MouseArea{
                    anchors.fill: parent;
                    onClicked :{
                        sendToSocket(JSON.stringify(["action", parent.buttonText]));
                    }
                }
            }
            MaterialButton {
                buttonText: "Metronome"; width: 150; height: 35;
                MouseArea{
                    anchors.fill: parent;
                    onClicked :{
                        sendToSocket(JSON.stringify(["action", parent.buttonText]));
                    }
                }
            }
            MaterialButton {
                buttonText: "Ondulation"; width: 150; height: 35;
                MouseArea{
                    anchors.fill: parent;
                    onClicked :{
                        sendToSocket(JSON.stringify(["action", parent.buttonText]));
                    }
                }
            }
            MaterialButton {
                buttonText: "Spiral"; width: 150; height: 35;
                MouseArea{
                    anchors.fill: parent;
                    onClicked :{
                        sendToSocket(JSON.stringify(["action", parent.buttonText]));
                    }
                }
            }
            MaterialButton {
                buttonText: "Slalom"; width: 150; height: 35;
                MouseArea{
                    anchors.fill: parent;
                    onClicked :{
                        sendToSocket(JSON.stringify(["action", parent.buttonText]));
                    }
                }
            }
        }

        JoyStick {
            id:joystick
            property string oldDir
            property int oldPower

            width: parent.height * 0.5
            height: parent.height * 0.5
            anchors.right: parent.right
            anchors.rightMargin: 50
            anchors.bottom: parent.bottom
            anchors.bottomMargin: 50
            onReleased: socket.sendTextMessage(JSON.stringify(["stop"]));
            onDirChanged: {
                var angle = Math.atan2(left, right)*57;
                if (angle != 0) {
                    socket.sendTextMessage(JSON.stringify(["move", angle, power]));
                    console.log("ANGLE : "+angle+" | POWER : "+power);
                }
            }
        }
    }
}

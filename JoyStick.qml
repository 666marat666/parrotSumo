import QtQuick 2.4
import QtQuick.Controls 1.3
import QtQuick.Window 2.2
import QtBluetooth 5.3
import QtQuick.Controls.Styles 1.4

Item {
    // JOYSTICK //////////////////////////////////////////

    id:joystick
    focus: true
    Keys.onPressed: {
        console.log("KEY: "+event.key);
        switch(event.key) {
        case 16777234: // left
            socket.sendTextMessage(JSON.stringify(["move", -90, 100]));
            break;
        case 16777236: // right
            socket.sendTextMessage(JSON.stringify(["move", 90, 100]));
            break;
        case 16777235: // up
            socket.sendTextMessage(JSON.stringify(["move", 0, 100]));
            break;
        case 16777237: // down
            socket.sendTextMessage(JSON.stringify(["move", 0, -100]));
            console.log("MOVED BACKWARD");
            break;
        }
    }

    Keys.onReleased: socket.sendTextMessage(JSON.stringify(["stop"]));

    signal dirChanged(int left, int right, int power)
    signal pressed()
    signal released()

    function launch() {
        var DIAM = Math.round(totalArea.radius);
        var X = Math.round((stick.x-(stick.radius))/DIAM*255);
        var Y = Math.round((-1 * (stick.y-(stick.radius)))/DIAM*255);
        var RIGHT = (Y-X);
        var LEFT = (X+Y);
        var power = (Math.max(Math.abs(RIGHT),Math.abs(LEFT)) * 127 )/ 255;
        dirChanged(X, Y, power);
    }

    // call launch (and dirChanged) every 25ms
    Timer {
        interval: 50
//        interval: 5
        running: true
        repeat: true
        onTriggered: launch()
    }

    // Big area of the joystick
    Rectangle {
        id: totalArea
        color: "#EF8F21"
        opacity: 0.5

        radius: parent.width/2
        width: parent.width
        height: parent.height
    }

    // small area of the joystick
    Rectangle {
        id: stick

        color: "#AFCD37"
        opacity: 0.7
        width: totalArea.width/2
        height: width
        radius: width/2

        x: totalArea.width/2 - radius
        y: totalArea.height/2 - radius
    }

    MouseArea{
        id: mouseArea

        anchors.fill: parent

        onPressed: {
            parent.pressed()
        }
        onReleased: {
            // center JoyStick
            stick.x = totalArea.width /2 - stick.radius
            stick.y = totalArea.height/2 - stick.radius

            parent.released()
        }

        onPositionChanged: {
            function angle_degrees(x, y) {
                if (x === 0 && y === 0){
                    return null
                }
                var tanx = Math.abs(y) / Math.abs(x)
                var angle = Math.atan(tanx) * 180 / Math.PI

                if (y < 0) {
                    angle = angle * -1
                }

                if (x <= 0 && y <= 0) {
                    angle = 270 + Math.abs(angle)
                } else if (x <= 0 && y >= 0) {
                    angle = 270 - Math.abs(angle)
                } else if (x >= 0 && y >= 0) {
                    angle = 90 + Math.abs(angle)
                } else {
                    angle = 90 - Math.abs(angle)
                }

                return angle
            }

            function direction(angle) {
                if (angle >= 45 && angle < 135) {
                    return "U"
                } else if (angle >= 135 && angle < 225) {
                    return "D"
                } else if (angle >= 225 && angle < 315) {
                    return "L"
                } else {
                    return "U"
                }
            }

            function set_value(val) {
                val = Math.round(val * 100) / 100
                if (val < 100 && val >= 10)
                    val = "+0"+val
                else if (val > -100 && val <= -10)
                    val = "-0"+Math.abs(val)
                else if (val === 0)
                    val = "+000"
                else if (val < 10 && val > 0)
                    val = "+00"+val
                else if (val > -10 && val < 0)
                    val = "-00"+Math.abs(val)
                else if (val >= 100)
                    val = "+"+val
                else if (val <= -100)
                    val = val
                return val
            }

            var xDist = mouseX - (totalArea.x + totalArea.radius)
            var yDist = mouseY - (totalArea.y + totalArea.radius)
            var dist = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2))
            var power = 0
            var DIAM = Math.round(totalArea.radius)
            var X = Math.round((stick.x-(stick.radius))/DIAM*255)
            var Y = Math.round((-1 * (stick.y-(stick.radius)))/DIAM*255)
            var LEFT = (Y-X)
            var RIGHT = (X+Y)

            //Calculate angle
            var angle = angle_degrees(xDist,yDist)

            //if distance is less than radius inner circle is inside larger circle
            if(totalArea.radius < dist) {
                //move the stick
                stick.x = totalArea.radius * Math.cos((angle - 90) * Math.PI / 180) + stick.radius
                stick.y = totalArea.radius * Math.sin((angle - 90) * Math.PI / 180) + stick.radius
                power = 100
            }
            else
            {
                //move the stick
                stick.x = mouseX - stick.radius
                stick.y = mouseY - stick.radius
                power = dist * 100 / (totalArea.width/2)
            }
            var dir = direction(angle)

        }
    }
}

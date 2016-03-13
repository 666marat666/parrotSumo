import QtQuick 2.0
import QtQuick.Window 2.2

Item {
    id: battery
    property int percent: 100;

    function setValue(newPercent) {
        percent = newPercent;
    }

    Rectangle {
        anchors.fill: parent;
        color: "transparent"
        border.width: 3
        border.color: "black"
        Rectangle {
            width: parent.width * 0.3
            height: width * 0.7
            color: "black"
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.bottom: parent.top
        }
    }
    Rectangle {
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 3
        width: parent.width - 6
        height: ((parent.height * percent) / 100) - 6
        color: percent>25?"green":"red"
    }

}

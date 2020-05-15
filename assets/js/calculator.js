browser = navigator.appName;
version = navigator.appVersion;
browser_version = navigator.userAgent.toLowerCase();
os = navigator.platform;


function Calc() {
    this.formular = document.kalkulator;
    this.elms = this.formular.elements;
    this.neuBerechnen = false;
}

Calc.prototype.check = function (sel) {
    if (this.elms == undefined) {
        var calculator = new Calc();
    }
    if (sel.value > this.elms[0].value) {
        alert('Value not possible: load capacity = ' + this.elms[0].value);
        sel.selectedIndex = 0;
        sel.previousSibling.childNodes[0].innerHTML = sel.options[0].text;
    } 
}

Calc.prototype.calculate = function () {

    D6 = this.elms[0].value;
    D8 = this.elms[1].value;
    D9 = this.elms[2].value;
    D12 = 1;
    D14 = this.elms[3].value;


    loads = new Array();
    ratioOfOperatingTime = new Array(); // D22, E22 etc.
    operatingTime = new Array();
    totalOperatingTime = 0;
    for (i = 0; i < 3; i++) {
        if (eval("this.formular.Heben" + i) != null) {
            if (eval("this.formular.Heben" + i + ".value") != 0) {
                D20 = eval("this.formular.Anzahl" + i + ".value");
                D17 = eval("this.formular.Senken" + i + ".value");
                D16 = eval("this.formular.Heben" + i + ".value");
                D19 = eval("this.formular.Last" + i + ".value");
                D18 = parseFloat(D16) + parseFloat(D17);

                D21 = ((parseFloat(D20) * D18) / parseFloat(D14)) / 60;

                operatingTime[i] = D21;
                totalOperatingTime = totalOperatingTime + D21;

                loads[i] = D19;
            }
        }
    }

    D24 = 0;
    D25 = totalOperatingTime;
    cubicMeanValue = 0;

    D21 = operatingTime[0];
    D22 = D21 / D25;
    D23 = loads[0] / D6;

    if (operatingTime[1] != undefined) {
        E21 = operatingTime[1];
        E22 = E21 / D25;
        E23 = loads[1] / D6;
    } else {
        E21 = 0;
        E22 = 0;
        E23 = 0;
    }

    if (operatingTime[2] != undefined) {
        F21 = operatingTime[2];
        F22 = F21 / D25;
        F23 = loads[2] / D6;
    } else {
        F21 = 0;
        F22 = 0;
        F23 = 0;
    }

    if (operatingTime[3] != undefined) {
        G21 = operatingTime[3];
        G22 = G21 / D25;
        G23 = loads[3] / D6;
    } else {
        G21 = 0;
        G22 = 0;
        G23 = 0;
    }

    cubicMeanValue = Math.pow((Math.pow(D23, 3) * D22 + Math.pow(E23, 3) * E22 + Math.pow(F23, 3) * F22 + Math.pow(G23, 3) * G22), (1 / 3));
    /*
       for(i=0;i<=operationalDemands.length;i++){
           D21 = operatingTime[i];
           if (D21 != undefined){
               ratioOfOperatingTime[i] = D21 / D25;
               cubicMeanValue = cubicMeanValue + operationalDemands[i]^3 * ratioOfOperatingTime[i];
           }
       } */


    D24 = cubicMeanValue;
    D25 = totalOperatingTime;

    D27 = Math.pow(D24, 3); // load spectrum
    D28 = D25 * D12;
    D29 = this.elms[4].value;
    D30 = D29 * D28 * D27;
    D31 = 18;
    D32 = D30 + D31;
    D33 = D32 / D8;
    D34 = D28 / (D12 / D9);
    D35 = D30 / (D12 / D9);

    reslt = (D8 - D32) / D35;
    if (reslt > 0 && reslt != Infinity) {

        reslt = Math.round(reslt * 10);
        reslt = reslt / 10;
        document.getElementById('result').innerHTML = reslt;
        document.getElementById('showResult').style.display = 'block';
        document.getElementById('berechnen').style.display = 'none';
        document.getElementById('actualize').style.display = 'block';
    } else {
        //document.getElementById('result').innerHTML = 'no valid data';
        document.getElementById('showResult').style.display = 'block';
    }

}

Calc.prototype.reset = function () {
    for (i = 0; i < this.elms.length; i++) {
        if (this.elms[i].tagName == 'SELECT') {
            this.elms[i].selectedIndex = 0;
            this.elms[i].previousSibling.childNodes[0].innerHTML = this.elms[i].options[0].text;
        }
    }
    document.getElementById('showResult').style.display = 'none';
    document.getElementById('actualize').style.display = 'none';
    document.getElementById('berechnen').style.display = 'block';
}

var newLeft = 0;
var leftScroll;

function refreshPosition(obj) {

    //alert("browser:" + browser + "\nVersion:" + version + "\nOS: "+os);

    if (os.indexOf('iPhone') > -1 || os.indexOf('iPad') > -1) {

        widths = document.getElementById(obj).childNodes[0].offsetWidth;
        innerScrolled = document.getElementById(obj).parentNode.scrollLeft;

        if (newLeft < innerScrolled) {
            leftScroll = 1;
        } else {
            leftScroll = 0;
        }
        newLeft = innerScrolled;

        if (leftScroll == 1) {
            if (innerScrolled > widths / 2 && innerScrolled < widths) {
                document.getElementById(obj).parentNode.scrollLeft = widths;
                newLeft = widths;
            }
            if (innerScrolled > (widths + (widths / 2)) && innerScrolled < widths * 2) {
                document.getElementById(obj).parentNode.scrollLeft = widths * 2;
                newLeft = widths * 2;
            }
            if (innerScrolled > (widths + widths + (widths / 2)) && innerScrolled < widths * 3) {
                document.getElementById(obj).parentNode.scrollLeft = widths * 3;
                newLeft = widths * 3;
            }
        } else {
            if (innerScrolled < widths / 2) {
                document.getElementById(obj).parentNode.scrollLeft = 0;
                newLeft = 0;
            }
            if (innerScrolled < (widths + (widths / 2)) && innerScrolled > widths) {
                document.getElementById(obj).parentNode.scrollLeft = widths;
                newLeft = widths;
            }
            if (innerScrolled < (widths + widths + (widths / 2)) && innerScrolled > widths * 2) {
                document.getElementById(obj).parentNode.scrollLeft = widths * 2;
                newLeft = widths * 2;
            }
        }
    }

}

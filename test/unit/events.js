/*
 * This file is a component of env.js,
 *     http://github.com/gleneivey/env-js/commits/master/README
 * a Pure JavaScript Browser Environment
 * Copyright 2009 John Resig, licensed under the MIT License
 *     http://www.opensource.org/licenses/mit-license.php
 */


module("events");

// This file is for tests of general event dispatching, propagation, and
//   handling functionality.  In keeping with the general non-exhaustive
//   approach of env.js's unit tests, each behavior is checked for one
//   relevant type of event in one relevant context (page structure, etc.).

// These tests rely on the content of ../html/events.html and of the
//   <iframe id='eventsFrame'> tag in ../index.html.

// These tests are order-dependent.  If you alter the order or add new tests
//   in the middle, the expected values of eventFrameLoaded and
//   eventFrameClicked may well change (perhaps requiring extra parameters
//   to the *Checks convenience functions).


function zero_ish(val){
    return (val==null || val==undefined || val==0);
}

function loadChecks(tag, imgCount, count){
    expect(4);

    var eCounters = document.getElementById('eventsFrame').
                      contentWindow.eCounters;
    try{ ok( eCounters["body onload"] ==    count,
        tag + ": Body-tag onload event recorded");
    }catch(e){print(e);}

    try{ ok( eCounters["img onload"]  == imgCount,
        tag + ": Img-tag onload event(s) recorded separately");
    }catch(e){print(e);}

    try{ ok( zero_ish(eCounters["body onclick"]) &&
             zero_ish(eCounters["h1 onclick"]) &&
             zero_ish(eCounters["h2 onclick"]) &&
             zero_ish(eCounters["div onclick"]) &&
             zero_ish(eCounters["table onclick"]) &&
             zero_ish(eCounters["tbody onclick"]) &&
             zero_ish(eCounters["tr onclick"]) &&
             zero_ish(eCounters["td onclick"]) &&
             zero_ish(eCounters["ul onclick"]) &&
             zero_ish(eCounters["li onclick"]) &&
             zero_ish(eCounters["p onclick"]) &&
             zero_ish(eCounters["b onclick"]) &&
             zero_ish(eCounters["i onclick"]) &&
             zero_ish(eCounters["a onclick"]) &&
             zero_ish(eCounters["img onclick"]),
        tag + ": Onload events recorded once.");
    }catch(e){print(e);}

    try{ ok( eventFrameLoaded == count && eventFrameClicked == 0,
        tag + ": " + count + " iframe events recorded on page load.");
    }catch(e){print(e);}
}


test("Check that events do/don't occur on document load", function() {
    // eCounters already initialized by code in ../html/events.html
    loadChecks("Load", 1, 1);
});

test("Check that events do/don't occur on manual iframe reload", function() {
    document.getElementById('eventsFrame').src = "html/events.html";
    loadChecks("Reload", 2, 2);
});

test("Check that an event which should NOT bubble actually does not",
     function() {
    var img = document.getElementById('eventsFrame').contentDocument.
      getElementById('theIMG').src = "missing.png";
    loadChecks("Load", 3, 2);

    // note: if img-onload had bubbled up, previous tests probably would
    //   have failed (too large body-onload counts), too.  So this test
    //   just ensures that operation is correct even when only part of
    //   page is reloading.
});



function clickChecks(tag, upperCount, lowerCount){
    expect(5);

    var eCounters = document.getElementById('eventsFrame').
                      contentWindow.eCounters;
    try{ ok( zero_ish(eCounters["body onload"]) &&
             zero_ish(eCounters["img onload"]),
        tag + ": Onload events not triggered by click");
    }catch(e){print(e);}

    var special = (upperCount == lowerCount) ? "" : " not";
    try{ ok( eCounters["ul onclick"] == lowerCount &&
             eCounters["li onclick"] == lowerCount &&
             eCounters["p onclick"] == lowerCount &&
             eCounters["b onclick"] == lowerCount &&
             eCounters["i onclick"] == lowerCount &&
             eCounters["a onclick"] == lowerCount &&
             eCounters["img onclick"] == lowerCount,
        tag + ": Click event did" + special + " bubble through inner elements");
    }catch(e){print(e);}

    try{ ok( eCounters["body onclick"] == upperCount &&
             eCounters["div onclick"] == upperCount &&
             eCounters["table onclick"] == upperCount &&
             eCounters["tbody onclick"] == upperCount &&
             eCounters["tr onclick"] == upperCount &&
             eCounters["td onclick"] == upperCount,
        tag + ": Click event bubbled through outer elements");
    }catch(e){print(e);}

    try{ ok( zero_ish(eCounters["h1 onclick"]) &&
             zero_ish(eCounters["h2 onclick"]),
        tag + ": No click events for Hx elements");
    }catch(e){print(e);}


    try{ ok( eventFrameLoaded == 2 && eventFrameClicked == 0,
        tag + ": Iframe event counts unchanged");
    }catch(e){print(e);}
}

test("Check that an event which should bubble actually does", function() {
    // clear in-iframe event counters to zero
    fWin = document.getElementById('eventsFrame').contentWindow;
    fWin.eCounters = {};
    fWin.initECounters(fWin.eCounters);

    // simulate a "click" user action
    var img = document.getElementById('eventsFrame').contentDocument.
      getElementById('theIMG');
    img.__click__(img);

    clickChecks("Click img", 1, 1);
});

test("Bubbling event ONLY bubbles 'up'", function() {
    // simulate a "click" user action
    var td = document.getElementById('eventsFrame').contentDocument.
      getElementById('theTD');
    td.__click__(td);

    clickChecks("Click td", 2, 1);
});

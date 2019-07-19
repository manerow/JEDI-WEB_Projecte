$(document).ready(function() {
    /* Static Data */
    const JSON_ROTATION = JSON.parse('{"freeChampionIds":[15,19,23,25,27,50,80,82,96,105,120,164,240,266],"freeChampionIdsForNewPlayers":[18,81,92,141,37,238,19,45,25,64,432,53,114,150],"maxNewPlayerLevel":10}');

    /* Objects */

    function character(name, image, image_lg, image_bg, blurb, tags, stats, rotation, newRotation) {
        this.name = name,
            this.image = image,
            this.image_lg = image_lg,
            this.image_bg = image_bg,
            this.blurb = blurb,
            this.tags = tags,
            this.stats = stats,
            this.rotation = rotation,
            this.newRotation = newRotation;
    }
    /* API Call URL */
    var CHAMPION_LIST_URL = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json';

    /* Image URLs */
    var CH_IMG_BASE_URL = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/';
    var CH_IMG_LG = 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/';
    var CH_IMG_BG = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/';

    /* Carousel Active-item related */
    var first = true;
    var newfirst = true;

    /* DataTable related */
    var nelem = 0;


    /* Storage */
    var myMap = new Map();
    var charSuggestion = [];

    /* Function Calls */
    getAllChampions();
    evaluateRotation();
    displayRotationCarousels();

    $('#charName > b').css("color", "white"); //Characters Table Name Color


    $('.statslink').on("click", function() { //OnClick event Characters Table 
        var ID = $(this).attr('id');
        var strCh = JSON.stringify(myMap.get(ID));
        console.log(strCh);
        localStorage.setItem('mCh', strCh);
    });


    /*      Carousel multi-item    */

    $('.carousel.carousel-multi-item .carousel-inner.v-2 .carousel-item').each(function() {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        for (var i = 0; i < 4; i++) {
            next = next.next();
            if (!next.length) {
                next = $(this).siblings(':first');
            }
            next.children(':first-child').clone().appendTo($(this));
        }
    });

    $("#dtBasicExample").DataTable({
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": false,
        "bAutoWidth": true
    });


    /* Input */

    /*      API CALLS       */

    function getAllChampions() {
        jQuery.ajax({
            url: CHAMPION_LIST_URL,
            success: function(result) {
                $.each(result.data, function(k, v) {
                    var image = CH_IMG_BASE_URL + v.id + '.png';
                    var image_lg = CH_IMG_LG + v.id + '_0.jpg';
                    var image_bg = CH_IMG_BG + v.id + '_0.jpg';
                    var ch = new character(v.name, image, image_lg, image_bg, v.blurb, v.tags, v.stats, false, false);
                    myMap.set(v.key, ch);
                    charSuggestion.push(v.name);
                    addChToTable(ch, v.key);
                });
            },
            async: false
        });
    }


    /* Character Table */

    function addChToTable(character, key) {
        if (nelem % 6 == 0) {
            $('#dtBasicExample > tbody:last-child')
                .append('<tr></tr>')
        }
        $('#dtBasicExample > tbody:last-child > tr:last-child')
            .append('<td><a href="stats.html" class="statslink" id="' + key + '"><div class="col"><div class="row"><img src="' + character.image + '"></div><div class="row"><span id="charName"><b>' + character.name + '<b><span></div></div></div></a></td>');
        nelem++;
    }

    /*     Main html Functions      */
    function evaluateRotation() {
        var freeChArr = JSON_ROTATION.freeChampionIds;
        $.each(freeChArr, function() {
            if (myMap.has(this.toString())) {
                var myCh = myMap.get(this.toString());
                myCh.rotation = true;
                myMap.set(this.toString(), myCh);
            }
        });

        var freeNewChArr = JSON_ROTATION.freeChampionIdsForNewPlayers;
        $.each(freeNewChArr, function() {
            if (myMap.has(this.toString())) {
                var myCh = myMap.get(this.toString());
                myCh.newRotation = true;
                myMap.set(this.toString(), myCh);
            }
        });

    }

    function displayRotationCarousels() {
        myMap.forEach(function(champion) {
            if (champion.rotation) {
                insertChRotation(champion.name, champion.image_lg);
            }

            if (champion.newRotation) {
                insertnewChRotation(champion.name, champion.image_lg);
            }
        });
    }

    function insertChRotation(name, image) {
        var ch;
        if (first) {
            ch = '<div class="carousel-item active">' +
                '<div class="col-12 col-md-2">' +
                '<div class="card mb-2">' +
                '<img class="card-img-top" src="' + image + '" alt="Card image cap"></img>' +
                '</div>' +
                '</div>' +
                '</div>';
            first = false;
        } else {
            ch = '<div class="carousel-item">' +
                '<div class="col-12 col-md-2">' +
                '<div class="card mb-2">' +
                '<img class="card-img-top" src="' + image + '" alt="Card image cap"></img>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        $('.carousel-inner > .carouselContent').append(ch);
    }

    function insertnewChRotation(name, image) {
        var nwch;
        if (newfirst) {
            nwch = '<div class="carousel-item active">' +
                '<div class="col-12 col-md-2">' +
                '<div class="card mb-2">' +
                '<img class="card-img-top" src="' + image + '" alt="Card image cap"></img>' +
                '</div>' +
                '</div>' +
                '</div>';
            newfirst = false;
        } else {
            nwch = '<div class="carousel-item">' +
                '<div class="col-12 col-md-2">' +
                '<div class="card mb-2">' +
                '<img class="card-img-top" src="' + image + '" alt="Card image cap"></img>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        $('.carousel-inner > .carouselContentNew').append(nwch);
    }

});

/* Stats Functions */

function fillStats() {
    var ch = JSON.parse(localStorage.getItem('mCh'));
    console.log(ch);
    $('#ch-img').attr("src", ch.image_lg);
    $('#blurb').text(ch.blurb);
    $('#chName').text(ch.name);
    var ctx = document.getElementById("myChart").getContext('2d');
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["HP", "HP per Level", "Armor", "Armor per Level", "Attack Damage", "AD per Level", "Attack Range"],
            datasets: [{

                data: [ch.stats.hp, ch.stats.hpperlevel, ch.stats.armor, ch.stats.armorperlevel, ch.stats.attackdamage, ch.stats.attackdamageperlevel, ch.stats.attackrange],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(255,99,132,1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {

            legend: {
                display: false,
            },
            scales: {

                yAxes: [{

                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white'
                    }
                }],
                xAxes: [{

                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white'
                    }
                }]
            }
        }
    });
    ch.tags.forEach(function(item) {
        console.log(item);
        $('#tags').append('<h6><span class="badge badge-primary">' + item + '</span></h6>');
    });
}
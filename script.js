$(function () {

    $('#cards').empty();

    $('#home-tab').on('hide.bs.tab', function (e) {
        $('#search').hide();
    });

    $('#home-tab').on('show.bs.tab', function (e) {
        $('#search').show();
    });

    $('#search').on('input', function (e) {
        const substr = $(e.target).val().toLowerCase();
        $('#cards').children().hide();
        $('#cards').children().filter(function () {
            return $(this).text().toLowerCase().includes(substr);
        }).show();
    });

    $.getJSON('https://api.coingecko.com/api/v3/coins/list')
        .done(function (coins) {

            $('#cards').empty();

            $('#cards')
                .append(coins
                    .slice(2100, 2200)
                    .map(coin => $(`
                        <div class="card col-sm-6 col-md-4 col-lg-3 col-xl-2">
                            <div class="card-body">
                                <h5 class="card-title text-uppercase">${coin.symbol}</h5>
                                <div class="custom-control custom-switch" style="position: absolute; top: 22px; right: 25px;">
                                    <input type="checkbox" class="custom-control-input" id="${coin.id}">
                                    <label class="custom-control-label" for="${coin.id}"></label>
                                </div>
                                <p>${coin.name}</p>
                                <button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#${coin.id}-more-info">
                                    More Info
                                </button>
                                <div class="collapse mt-4 more-info" id="${coin.id}-more-info">
                                    <div class="card border-primary p-4" style="border-radius: 200em 200em 0 0;">
                                        <img class="card-img-top img-thumbnail rounded-circle border-dark" src="img/dollar.gif" />
                                        <div class="card-body d-flex flex-column align-items-center">
                                            <div class="spinner-grow"></div>
                                            <div class="spinner-grow"></div>
                                            <div class="spinner-grow"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`)));

            $('.more-info').on('shown.bs.collapse', function (e) {
                const match = e.target.id.match(/(.*)-more-info/);
                if (1 < match.length) {
                    $.getJSON(`https://api.coingecko.com/api/v3/coins/${match[1]}?tickers=false&community_data=false&developer_data=false`)
                        .done(function (info) {
                            const cardImg = $('.card-img-top', e.target);
                            cardImg.attr('src', info.image.large);
                            const cardBody = $('.card-body', e.target);
                            cardBody.empty();
                            cardBody.append(`<h5 class="card-text text-center">&dollar;${info.market_data.current_price.usd}</h5>`);
                            cardBody.append(`<h5 class="card-text text-center">&pound;${info.market_data.current_price.gbp}</h5>`);
                            cardBody.append(`<h5 class="card-text text-center">&#8362;${info.market_data.current_price.ils}</h5>`);
                        });
                } else {
                    throw new Error(`${e.target.id} doesn't match expected pattern /(.*)-more-info/.`);
                }
            });

        });

    Highcharts.chart('chart', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            }
        },

        time: {
            useUTC: false
        },

        title: {
            text: 'Live random data'
        },

        accessibility: {
            announceNewData: {
                enabled: true,
                minAnnounceInterval: 15000,
                announcementFormatter: function (allSeries, newSeries, newPoint) {
                    if (newPoint) {
                        return 'New point added. Value: ' + newPoint.y;
                    }
                    return false;
                }
            }
        },

        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },

        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },

        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
        },

        legend: {
            enabled: false
        },

        exporting: {
            enabled: false
        },

        series: [{
            name: 'Random data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        }]
    });

});
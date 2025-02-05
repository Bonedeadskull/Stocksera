// If there is an error, hide the page
function display_data() {
    var error_msg_class = document.getElementById("error_msg").className;
    if (error_msg_class == "instructions error_true") {
        document.getElementById("error_msg").style.removeProperty("display");
        document.getElementsByClassName("contents_div")[0].style.display = "none";
    }
}

// If price is positive, show green colour, else show red
function update_price_color() {
    var tickers = document.getElementsByClassName("ticker_item");
    for (i=0; i<tickers.length; i++) {
        if (tickers[i].querySelector("span").innerHTML.includes("+") == true) {
            tickers[i].querySelector("span").style.color="#26a69a"
        }
        else {
            tickers[i].querySelector("span").style.color="#ef5350"
        }
    }
}

// Highlight the nav bar if selected
function highlight_selected_nav(elem) {
    document.getElementById(elem).classList.add("current_link")
}

// For smaller screen. Function to show/hide nav bar
function top_right_nav(elem) {
    var nav_bar_div = document.getElementById("nav_bar_div");
    var dark_mode_btn = document.getElementById("dark_mode_btn");
    if (elem.classList.contains("opened")){
        elem.classList.remove("opened")
        nav_bar_div.style.height = 0;
        nav_bar_div.style.width = 0;
        nav_bar_div.querySelector("ul").style.display = "none"
        dark_mode_btn.style.display = "none"
    }
    else {
        elem.classList.add("opened")
        nav_bar_div.style.height = "280px";
        nav_bar_div.style.width = "100%";
        nav_bar_div.querySelector("ul").style.display = "block"
        dark_mode_btn.style.display = "block"
    }
}

// Change to dark/light mode depending on toggle on nav bar
function activate_dark_mode() {
    var iframe = document.getElementsByTagName("iframe");
    if (document.getElementById("dark_mode").checked == true) {
        document.getElementsByTagName("body")[0].classList.add("dark_mode");
        localStorage.setItem("mode", "dark");
        if (iframe.length > 1) {
            for (i=1; i<iframe.length; i++) {
                if (typeof(iframe[i].contentDocument) != null) {
                    try {
                        iframe[i].contentDocument.getElementsByTagName("body")[0].classList.add("dark_mode")
                    }
                    catch {
                        console.log("error")
                    }

                }
            }
        }
        if (document.querySelector("#intro_images") != null) {
            img = document.querySelector("#intro_images").querySelectorAll("img")
            for (i=0; i<img.length; i++) {
                img[i].src = img[i].src.replace("light", "dark")
            }
        }
    }
    else {
        document.getElementsByTagName("body")[0].classList.remove("dark_mode");
        localStorage.setItem("mode", "light");
        if (iframe.length > 1) {
            for (i=1; i<iframe.length; i++) {
                if (typeof(iframe[i].contentDocument) != null) {
                    try {
                        iframe[i].contentDocument.getElementsByTagName("body")[0].classList.remove("dark_mode")
                    }
                    catch {
                        console.log("error")
                    }
                }
            }
        }
        if (document.querySelector("#intro_images") != null) {
            img = document.querySelector("#intro_images").querySelectorAll("img")
            for (i=0; i<img.length; i++) {
                img[i].src = img[i].src.replace("dark", "light")
            }
        }
    }
}

// If dark mode is selected previously, show dark page when it is loaded
function restore_dark_mode() {
    if (localStorage.getItem("mode") == "dark") {
        document.getElementsByTagName("body")[0].classList.add("dark_mode");
        document.getElementById("dark_mode").checked = true;
    }
}

// If ticker's company image is missing, show its symbol instead
function load_error_img(elem, symbol) {
    if (symbol.length >= 5) {
        symbol_text = `<div style="font-size:inherit">${symbol}</div>`
    }
    else {
        symbol_text = `<div>${symbol}</div>`
    }
    document.getElementById("ticker_basic_stats").innerHTML = `<div id="no_img_div">
    ${symbol_text}</div>` + document.getElementById("ticker_basic_stats").innerHTML
}

// If ticker's company image is missing, show its symbol instead
function load_table_error_img(elem, symbol) {
    elem.parentElement.innerHTML = `<div class="no_img_table_div">
        <div class="no_img_table_img table_ticker_logo">
            <div>${symbol[0]}</div>
        </div>
        <div class="no_img_table_img_symbol"><b>${symbol}</b></div>
        </div>`
    elem.remove()
}

// Check that dictionary has a key
function check_stats(property) {
    if (information.hasOwnProperty(property) == true) {
        property_name = information[property]
    }
    else {
        property_name = "N/A"
    }
    return property_name
}

// Check that property is a number and convert to locale string. else N/A
function check_if_num(property) {
    property_name = information[property]
    if (typeof(property_name) == "number") {
        property_name= Number(property_name).toLocaleString()
    }
    else {
        property_name = "N/A"
    }
    return property_name
}

// Show basic stats of ticker (price, change, industry, sector)
function show_ticker_price(information) {
    var latest_price = information["regularMarketPrice"];
    var mkt_close = information["previousClose"];
    var price_change = information["regularMarketChange"]
    var price_percentage_change = information["regularMarketChangePercent"]

    if (price_change > 0) {
        price_change = "+" + String(price_change)
        price_percentage_change = "+" + String(price_percentage_change)
        color_type = "positive_price"
    }
    else {
        color_type = "negative_price"
    }

    <!--If ticker does not have an image, show a default image-->
    var img = `https://g.foolcdn.com/art/companylogos/mark/${information["symbol"]}.png`
    var img_code = `<img src="${img}" onerror="this.error=null;this.parentElement.remove();load_error_img(this, information['symbol'])">`

    <!--Code to display image, full name, symbol, industry and sector-->
    var official_name = check_stats("longName")
    var sector = check_stats("sector")
    var industry = check_stats("industry")

    var current_mkt_status = information["marketState"]

    if (current_mkt_status == "REGULAR") {
        mkt_pre_post_code = ""
    }
    if (current_mkt_status == "PRE" & information["preMarketChange"] != "N/A") {
        mkt_pre_post_code = `<div style="font-size:9px">Pre: $${Math.round((Number(latest_price.replace(",", "")) + Number(information["preMarketChange"])) * 100) / 100} (${information["preMarketChangePercent"]})</div> `
    }
    else if ( (current_mkt_status == "PREPRE" || current_mkt_status == "POST" || current_mkt_status == "POSTPOST" || current_mkt_status == "CLOSED") & information["postMarketChange"] != "N/A") {
        mkt_pre_post_code = `<div style="font-size:9px">Post: $${Math.round((Number(latest_price.replace(",", "")) + Number(information["postMarketChange"])) * 100) / 100} (${information["postMarketChangePercent"]})</div> `
    }
    else {
        mkt_pre_post_code = ""
    }

    var price_code = `<div class="price_details ${color_type}">$${latest_price}
        <br> <div>${price_change} (${price_percentage_change})</div>
        ${mkt_pre_post_code}</div>`

    var ticker_basic_stats_code = `
        <div id="img_div">${img_code}</div>
        <div id="ticker_intro">
            <span>${official_name} (${information["symbol"]})</span>
            <br>Sector: <b>${sector}</b><br>Industry: <b>${industry}</b>
        </div>
        ${price_code}`
    document.getElementById("ticker_basic_stats").innerHTML = ticker_basic_stats_code;
}

// Alter the graph range based on button selected
function btn_selected(elem) {
    date_range = document.getElementsByName("date_range")
    for (i=0; i<date_range.length; i++) {
        date_range[i].classList.remove("selected")
    }
    elem.classList.add("selected")
}

// If -10% in price change, show SSR symbol
function get_ssr(information) {
    low_price = information["regularMarketDayLow"]
    previous_close = information["previousClose"]
    quote_type = information["quoteType"]
    if (isNaN(low_price) == false & isNaN(previous_close) == false) {
        difference = previous_close - low_price
        percent_diff = difference / previous_close
        if (quote_type == "EQUITY") {
            quote_type = "Equity"
        }
        if (quote_type != "N/A") {
            quote_type_div = `<div class='quote_type_color'>${quote_type}</div>`
        }

        if (percent_diff >= 0.10) {
            class_type = "positive_price"
            ssr = "On"
        }
        else {
            class_type = "negative_price"
            ssr = "Off"
        }
        document.getElementById("ssr_msg").innerHTML = `<div class=${class_type}>SSR ${ssr}</div>${quote_type_div}`
    }
}

// If stock is not listed in US, hide graph and some other functionality
function check_if_us_stock(symbol) {
    if (symbol.includes(".")) {
        if (document.getElementById("ticker_chart") != null) {
            document.getElementById("ticker_chart").style.display = "none"
        }
        more_info_div = document.getElementsByClassName("more_info_div")
        more_info_div[2].style.display = "none"
        more_info_div[3].style.display = "none"
        more_info_div[4].style.display = "none"
    }
}

// Get date difference between current time and duration
function get_date_difference(duration, delimiter) {
    var d = new Date();
    d.setMonth(d.getMonth() - duration);
    var dd = d.getDate();
    if (dd <= 9) {
        dd = "0" + dd
    }
    var mm = d.getMonth() + 1;
    if (mm <= 9) {
        mm = "0" + mm
    }
    var yyyy = d.getFullYear();
    var date_threshold = yyyy + delimiter + mm + delimiter + dd;
    return date_threshold
}

// Get next economic release date in economic sector
function get_economic_releases(elem) {
    today_date = new Date()
    day = today_date.getDate()
    month = today_date.getMonth() + 1
    if (day < 10) {
        day = "0" + day
    }
    if (month < 10) {
        month = "0" + month
    }
    year = today_date.getFullYear()
    today_date = year + "-" + month + "-" + day

    rrp = elem["Reverse Repo"]["Release Date"]
    treasury_json = elem["Daily Treasury"]["Release Date"]
    inflation_json = elem["Inflation"]["Release Date"]
    retail_sales_json = elem["Retail Sales"]["Release Date"]

    if (rrp == today_date) {
        rrp_code = `<div style="color:red">RRP: ${rrp} </div>`
    }
    else {
        rrp_code = `<div>RRP: ${rrp} </div>`
    }
    if (treasury_json == today_date) {
        treasury_code = `<div style="color:red">Treasury: ${treasury_json} </div>`
    }
    else {
        treasury_code = `<div>Treasury: ${treasury_json} </div>`
    }
    if (inflation_json == today_date) {
        inflation_code = `<div style="color:red">Inflation: ${inflation_json} (Pre)</div>`
    }
    else {
        inflation_code = `<div>Inflation: ${inflation_json} (Pre)</div>`
    }
    if (retail_sales_json == today_date) {
        retail_sales_code = `<div style="color:red">Retail Sales: ${retail_sales_json} (Pre)</div>`
    }
    else {
        retail_sales_code = `<div>Retail Sales: ${retail_sales_json} (Pre)</div>`
    }

    code = `
            <div style="display:inline-block;width:52%">
                ${rrp_code}
                ${treasury_code}
            </div>
            <div style="display:inline-block">
                ${inflation_code}
                ${retail_sales_code}
            </div>`
    document.getElementById("releases_div").innerHTML += code
}

// Expand iframe to appropriate size when loaded
function expand_iframe(elem) {
    height = elem.contentWindow.document.body.scrollHeight
    elem.style.height = height + 'px';
}

//$(document).on('dblclick', 'input[list]', function(event){
//    event.preventDefault();
//        var str = $(this).val();
//    $('div[list='+$(this).attr('list')+'] span').each(function(k, obj){
//            if($(this).html().toLowerCase().indexOf(str.toLowerCase()) < 0){
//                $(this).hide();
//            }
//        })
//    $('div[list='+$(this).attr('list')+']').toggle(100);
//    $(this).focus();
//})
//
//$(document).on('blur', 'input[list]', function(event){
//        event.preventDefault();
//        var list = $(this).attr('list');
//        setTimeout(function(){
//            $('div[list='+list+']').hide(100);
//        }, 100);
//    })
//
//    $(document).on('click', 'div[list] span', function(event){
//        event.preventDefault();
//        var list = $(this).parent().attr('list');
//        var item = $(this).html();
//        $('input[list='+list+']').val(item);
//        $('div[list='+list+']').hide(100);
//    })
//
//$(document).on('keyup', 'input[list]', function(event){
//        event.preventDefault();
//        var list = $(this).attr('list');
//    var divList =  $('div[list='+$(this).attr('list')+']');
//    if(event.which == 27){ // esc
//        $(divList).hide(200);
//        $(this).focus();
//    }
//    else if(event.which == 13){ // enter
//        if($('div[list='+list+'] span:visible').length == 1){
//            var str = $('div[list='+list+'] span:visible').html();
//            $('input[list='+list+']').val(str);
//            $('div[list='+list+']').hide(100);
//        }
//    }
//    else if(event.which == 9){ // tab
//        $('div[list]').hide();
//    }
//    else {
//        $('div[list='+list+']').show(100);
//        var str  = $(this).val();
//        $('div[list='+$(this).attr('list')+'] span').each(function(){
//          if($(this).html().toLowerCase().indexOf(str.toLowerCase()) < 0){
//            $(this).hide(10);
//          }
//          else {
//            $(this).show(10);
//          }
//        })
//      }
//    })

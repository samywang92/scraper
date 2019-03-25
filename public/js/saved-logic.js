$(document).ready(function () {
    $.getJSON("/api/saved", data => {
        data.forEach(article => {
            const text = article.text.replace(/Read more/ig, `<a href="https://www.nintendo.com${article.link}">Read more</a>`);
            const wasSaved = article.saved ? "check_circle":"add_circle_outline";
            const html = `
        <div class="row">
            <div class="card">
                <img class="side-img responsive-img" src="${article.img}" alt="${article.imgAlt}" align="left">
                <h5 class="white-text red darken-1">${article.title}</h5>
                <p class="grey-text text-darken-2">Date published: ${article.date}</p>
                <p class="grey-text text-darken-2">${text}</p>
                <div class="btn-holder valign right">
                    <a class="waves-effect waves-light btn-small red save-btn" id="${article._id}"><i
                            class="material-icons left">${wasSaved}</i>Save Article</a>
                </div>
            </div>
        </div>
        `;
            $(".articles").append(html);
        });
    });

    //When the home button is clicked
    $(document).on("click", "#home", function () {
        window.location.href = "./";
    });

    //When the saved articles button is clicked
    $(document).on("click", "#saved", function () {
        window.location.href = "./saved";
    });

    //When the grab news button is clicked
    $(document).on("click", "#grab-news", function () {
        console.log("testers");
        //$(".articles").empty();
        $.ajax({
            method: "GET",
            url: "/scrape/"
        }).then((data) => {
            console.log(data);
            location.reload();
        }).catch(err => console.log(err));
    });

    //When the clear news button is clicked
    $(document).on("click", "#clear-news", function () {
        console.log("testers");
        $(".articles").empty();
        $.ajax({
            method: "DELETE",
            url: "/api/articles/"
        }).then((data) => {
            console.log(data);
            location.reload();
        }).catch(err => console.log(err));
    });

    //When the save article button is clicked
    $("body").on("click", ".save-btn", function () {
        //console.log("IN THE VOID");
        const self = this;
        const id = $(self).attr("id");

        //console.log(id);
        $.ajax({
            method: "GET",
            url: "/api/articles/" + id
        }).then(data => data[0].saved ? $(self).children("i").text("add_circle_outline"):$(self).children("i").text("check_circle")
        ).catch(err => console.log(err));
    });
});
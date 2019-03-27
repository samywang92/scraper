$(document).ready(function () {
    loadArticles();
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
            method: "PUT",
            url: "/api/articles/" + id
        }).then(data => $(`#${id}`).remove()).catch(err => console.log(err));
        // data[0].saved ? $(self).children("i").text("add_circle_outline") : $(self).children("i").text("check_circle")
        //not working call back maybe ask sammy?
        // {
        //     $(`.articles`).empty();
        //     $(`.articles`).load(window.location.href + " .articles" );
        //     reloadArticles(data,loadArticles)
        // }
    });

    //Callback attempt for reloadArticles
    function reloadArticles(data, loadFunction) {
        console.log(data);
        loadFunction();
    }

    //When the view notes button is clicked
    $("body").on("click", ".note-btn", function () {
        $("#notes").empty();
        const thisId = $(this).attr("id");
        console.log(thisId);

        $.ajax({
            method: "GET",
            url: "/api/articles/" + thisId
        })
            .then(function (data) {
                console.log(data);
                // An input to enter a new title
                $("#notes-display").append(`<h5>Note for ${data[0]._id}</h5>`);
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                $(".submit-note").attr("id", data[0]._id);

                // If there's a note in the article
                if (data[0].note) {
                    console.log("its been found");
                    console.log(data[0].note.body);
                    // Place the title of the note in the title input
                    $("#notes-display").append(`<p>${data[0].note.body}</p>`);;
                }
            });
    });

    $("body").on("click", ".submit-note", function () {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/api/articles/" + thisId,
            data: {
                body: $("#bodyinput").val()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
                $("#notes-display").empty();
            });
        $("#bodyinput").val("");
    });

    //Load articles function
    function loadArticles() {
        $.getJSON("/api/saved", data => {
            data.forEach(article => {
                const text = article.text.replace(/Read more/ig, `<a href="https://www.nintendo.com${article.link}">Read more</a>`);
                const wasSaved = article.saved ? "check_circle" : "add_circle_outline";
                const html = `
            <div class="row">
                <div class="card" id="${article._id}">
                    <img class="side-img responsive-img" src="${article.img}" alt="${article.imgAlt}" align="left">
                    <h5 class="white-text red darken-1">${article.title}</h5>
                    <p class="grey-text text-darken-2">Date published: ${article.date}</p>
                    <p class="grey-text text-darken-2">${text}</p>
                    <div class="btn-holder valign right">
                        <a class="waves-effect waves-light btn-small red save-btn" id="${article._id}"><i
                                class="material-icons left">${wasSaved}</i>Save Article</a>
                        <a href="#note-modal" class="waves-effect waves-light btn-small amber note-btn modal-trigger" id="${article._id}"><i
                            class="material-icons left">note</i>View Notes</a>
                    </div>
                </div>
            </div>
            `;
                $(".articles").append(html);
            });
        });
    }
});
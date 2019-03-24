// $.getJSON("/articles", data => data.foreach(article => {
//     console.log(article);
// }) 
$.getJSON("/articles", data => {
    data.forEach(article => {
        //console.log(article);
        // const pulledText = String(article.text);
        // const pulledText = `${article.text}`;
        //ask about this nonsense for regex
        //const pulledText = "lolol ok what ... Read more";
        //const pulledText = "Off ... Read more";
        const text = article.text.replace(/Read more/ig, `<a href="https://www.nintendo.com${article.link}">Read more</a>`);
        //console.log(text);
        //console.log(article._id);
        const html = `
        <div class="row">
            <div class="card">
                <img class="side-img responsive-img" src="${article.img}" alt="${article.imgAlt}" align="left">
                <h5 class="white-text red darken-1">${article.title}</h5>
                <p class="grey-text text-darken-2">Date published: ${article.date}</p>
                <p class="grey-text text-darken-2">${text}</p>
                <div class="btn-holder valign right">
                    <a class="waves-effect waves-light btn-small red save-btn" id="${article._id}"><i
                            class="material-icons left">add_circle_outline</i>Save Article</a>
                </div>
            </div>
        </div>
        `;
        $(".articles").append(html);
    });
});

$(document).on("click", "#grab-news", function() {
    console.log("testers");
    $(".articles").empty();
    $.ajax({
        method: "GET",
        url: "/scrape/"
      }).then((data) => {
        console.log(data);
        location.reload();
      }).catch(err => console.log(err));
});
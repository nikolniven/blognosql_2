const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentSection = document.getElementById("comments");
const commentsForm = document.querySelector("#comments-form form");
const commentTitle = document.getElementById("title");
const commentText = document.getElementById("text");

function createCommentsList(comments) {
  const commentList = document.createElement("ol");

  console.log(
    "COMMMENTS",
    typeof comments,
    typeof comments.comments,
    comments.comments[0],
  );

  for (const comment of comments.comments) {
    // first element of the object
    // Object is called comments, the first element is called comments and that first element is the array we want to loop trough
    // we are looping trough the comments of the comments object, which in an array
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
    <article class="comment-item">
     <h2>${comment.title}</h2>
     <p>${comment.text}</p>
    </article>`;

    commentList.appendChild(commentElement);
  }

  return commentList;
}
async function fetchCommentsForPost() {
  const postId = loadCommentsBtnElement.dataset.postid;
  try{
    const response = await fetch(`/posts/${postId}/comments`);
    if (!response.ok) {
      alert("Fetching comments failed!");
      return;
    }
    const resData = await response.json();
  
    console.log(resData);
  
    if (resData && resData.comments.length > 0) {
      const commentsListElement = createCommentsList(resData);
      commentSection.innerHTML = "";
      commentSection.appendChild(commentsListElement);
    } else {
      commentSection.firstElementChild.textContent =
        "We could not find any comments, maybe add one ☺️";
    }catch(error){
      alert('Getting comments failed😞')
    }

  }


async function saveComment(event) {
  event.preventDefault();
  const postId = commentsForm.dataset.postid;
  const enteredTitle = commentTitle.value;
  const enteredText = commentText.value;
  const comment = { title: enteredTitle, text: enteredText };

  console.log(enteredTitle, enteredText);
  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchCommentsForPost();
    } else {
      const commentError = document.createTextNode(
        "oh naur, an error has occurred, couldnt send the comment!",
      );
      commentSection.innerHTML = "";
      commentSection.appendChild(commentError);
    }
  } catch (error) {
    console.log("Error:", error.message);
    alert("Could not send request, maybe try again later");
  }
}
loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
commentsForm.addEventListener("submit", saveComment);

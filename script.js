

const commentsList = [
    {
        id: 1,
        avatarImg: 'img/supperman.png',
        userName: 'Superman',
        commentText: 'Hi There',
        replies: [{
        id: 2,
        avatarImg: "img/antman.png",
        userName: 'Ant-Man',
        commentText: 'Yo',
        }]
    },
    {
        id: 6,
        avatarImg: "img/supperwomen.jpg",
        userName: 'Superwomen',
        commentText: 'Second comment',
        replies: [],
    },
    {
        id: 3,
        userName: 'Spider-Man',
        avatarImg: "img/spiderman.png",
        commentText: 'Third comment',
        replies: [{
            id: 4,
            avatarImg: "img/spiderwomen.webp",
            userName: 'Spider-Women',
            commentText: 'this is the first reply',
        },
        {
            id: 5,
            avatarImg: "img/wonderwomen.png",
            userName: 'Wonder-Women',
            commentText: 'this is the second reply',
        },
        ]
    }
];

document.addEventListener("DOMContentLoaded", function(){
    const submitBtn = document.getElementById('submit-comment');
    const commentInput = document.getElementById('comment-input');
    const commentsContainer = document.querySelector(".comments-container");
    let currentReplyComment = null;
    let currentSubmitReplyBtn = null;
    let currentEditComment = null;
    let currentSubmitEditBtn = null;

    let lastId = getUniqueID();

    // Add New Comment
    submitBtn.addEventListener('click', function() {
        const commentText = commentInput.value.trim();
        if (commentText !== '') {
          commentsList.push({
            id: lastId++,
            avatarImg: 'img/bitel.jpg',
            userName: 'New User',
            commentText: commentText,
          })
          commentInput.value = '';
          loadUI();
        }
    });

    // Get Unique ID
    function getUniqueID() {
        let maxID = 0;
        commentsList.forEach(comment => {
          if (comment.id > maxID) {
            maxID = comment.id;
          }
          if (comment.replies) {
            comment.replies.forEach(reply => {
              if (reply.id > maxID) {
                maxID = reply.id;
              }
            });
          }
        });
        return maxID + 1;
      }

    // Add All Pre-Define Comment
    function loadUI(){
        commentsContainer.innerHTML = "";
        commentsList.forEach(comment => {
            addComment(commentsContainer, comment);
        })
    }

    // Add Comment 
    function addComment(parentContainer, comment){

        // Comment div
        const commentDiv = document.createElement("div");
        commentDiv.id = comment.id;
        commentDiv.classList.add("comment");

        // Parent Comment Div
        const parentCommentDiv = document.createElement("div");
        parentCommentDiv.classList.add("parent-comment");
        commentDiv.appendChild(parentCommentDiv);

        // Reply Comment Div
        const replies = document.createElement("div");
        replies.classList.add("replies");
        commentDiv.appendChild(replies);

        // Avatar added to comment
        const avatar = document.createElement("img");
        avatar.src = comment.avatarImg;
        avatar.alt = "User Avatar";
        avatar.classList.add("avatar");
        parentCommentDiv.appendChild(avatar);

        // Comment Details
        const commentDetails = document.createElement("div");
        commentDetails.classList.add("comment-details");
        parentCommentDiv.appendChild(commentDetails);

        // comment User Name
        const nameElemet = document.createElement("h3");
        nameElemet.classList.add("user-name");
        nameElemet.textContent = comment.userName;
        commentDetails.appendChild(nameElemet);

        // Comment Text
        const commentTextNode = document.createElement("p");
        commentTextNode.classList.add("comment-text");
        commentTextNode.textContent = comment.commentText;
        commentDetails.appendChild(commentTextNode);

        // Comment Actions (Buttons)
        const commentActions = document.createElement("div");
        commentActions.classList.add("comments-actions");
        commentDetails.appendChild(commentActions);

        // Buttons
        // Reply Button
        const replyBtn = document.createElement("button");
        replyBtn.classList.add("reply-btn");
        replyBtn.textContent = "Reply";
        replyBtn.addEventListener("click", function(){
            handleReply(commentDiv);
        });
        commentActions.appendChild(replyBtn);

        // Edit Button
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function(){
            handleEdit(commentDiv);
        });
        commentActions.appendChild(editBtn);

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function(){
            handleDelete(commentDiv);
        });
        commentActions.appendChild(deleteBtn);

        if(comment && comment.replies && comment.replies.length > 0){
            comment.replies.forEach(reply => {
                addComment(replies, reply);
            })
        }

        parentContainer.appendChild(commentDiv);
    }

    // Update Comment List
    function updateCommentsList(commentId, commentText){
        const processing = (list) => {
            list.forEach(comment => {
                if(comment.id == commentId){

                    if(!comment.replies) comment.replies = [];

                    comment.replies.push({
                        id: lastId++,
                        avatarImg: 'img/ironman.png',
                        userName: 'New User',
                        commentText: commentText,
                    });
                }

                if(comment.replies && comment.replies.length > 0){
                    processing(comment.replies);
                }
            })
        }

        processing(commentsList);
    }

    // Handle Reply
    function handleReply(commentDiv){

        if(currentReplyComment){
            currentReplyComment.parentNode.removeChild(currentReplyComment);
            currentSubmitReplyBtn.parentNode.removeChild(currentSubmitReplyBtn);
        }

        // Input text for reply
        const replyInput = document.createElement("input");
        replyInput.type = "text";
        replyInput.placeholder = "Enter your reply...";
        replyInput.classList.add("reply-input");

        // Submit Btn for reply Comment
        const submitBtn = document.createElement("button");
        submitBtn.classList.add("submit-btn");
        submitBtn.textContent = "Submit";
        submitBtn.addEventListener("click", function(){
            const inputText = replyInput.value.trim();
            if(inputText !== ""){
                updateCommentsList(commentDiv.id, inputText);
                replyInput.parentNode.removeChild(replyInput);
                submitBtn.parentNode.removeChild(submitBtn);
                currentReplyComment = null;
                currentSubmitReplyBtn = null;
                loadUI();
            }
        });

        commentDiv.querySelector(".comment-details").appendChild(replyInput);
        commentDiv.querySelector(".comment-details").appendChild(submitBtn);
        currentReplyComment = replyInput;
        currentSubmitReplyBtn = submitBtn;
    }

    // Remove Comment (Delete Comment)
    function removeByCommentId(commentId){
        const processing = (list) => {
            list.forEach((comment, index) => {
                if(comment.id == commentId){
                    list.splice(index, 1);
                }

                if(comment.replies && comment.replies.length > 0){
                    processing(comment.replies);
                }
            })
        }

        processing(commentsList);
    }

    // Handle Delete
    function handleDelete(commentDiv){
        removeByCommentId(parseInt(commentDiv.id));
        loadUI();
    }

    // Edit Comment
    function editCommentsList(commentId, commentText) {
        const processing = (list) => {
          list.forEach(comment => {
            if (comment.id == commentId) {
              comment.commentText = commentText;
            }
            if (comment.replies && comment.replies.length > 0) {
              processing(comment.replies);
            }
          })
        }
    
        processing(commentsList);
      }

    // Handle Edit
    function handleEdit(commentDiv) {

        if(currentEditComment){
            currentEditComment.parentNode.removeChild(currentEditComment);
            currentSubmitEditBtn.parentNode.removeChild(currentSubmitEditBtn);
        }

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = commentDiv.querySelector('.comment-text').textContent;
        editInput.placeholder = 'Enter your new input...';
        editInput.classList.add('edit-input');
    
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit';
        submitBtn.classList.add('edit-button');
        submitBtn.addEventListener('click', function() {
          const newCommentText = editInput.value.trim();
          if (newCommentText !== '') {
            editCommentsList(commentDiv.id, newCommentText);
            editInput.parentNode.removeChild(editInput);
            submitBtn.parentNode.removeChild(submitBtn);
            currentEditComment = null;
            currentSubmitEditBtn = null;
            loadUI();
          }
        });
    
        commentDiv.querySelector('.comment-details').appendChild(editInput);
        commentDiv.querySelector('.comment-details').appendChild(submitBtn);
        currentEditComment = editInput;
        currentSubmitEditBtn = submitBtn;
      }

    loadUI();
})
import React, { useEffect, useState } from "react";
import "./Comments_module.css";
import {
  createComment,
  listComments,
  updateComment,
  deleteComment,
  getLike,
} from "../services/CommentService";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

const Comments = ({ goods_id, member_id }) => {
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState({});
  const [commentsList, setCommentsList] = useState([]);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [likedComments, setLikedComments] = useState(new Set()); // Store liked comment IDs

  useEffect(() => {
    if (goods_id) {
      listComments(goods_id)
        .then((response) => {
          const sortedComments = response.data.reverse();
          setCommentsList(sortedComments);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [goods_id]);

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      setNewComment({
        goods: {
          id: goods_id,
        },
        member: {
          id: member_id,
        },
        comment: comment,
        like: 0,
      });
    }
  };

  useEffect(() => {
    if (newComment && newComment.member && newComment.goods) {
      createComment(newComment)
        .then((response) => {
          console.log("Comment added successfully:", response.data);
          setNewComment({});
          return listComments(goods_id);
        })
        .then((response) => {
          const sortedComments = response.data.reverse();
          setCommentsList(sortedComments);
          setComment(""); // Clear the input field
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [newComment]);

  const handleEditClick = (id, text) => {
    setEditCommentId(id);
    setEditedText(text);
  };

  const handleEditChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleUpdate = (id) => {
    if (editedText.trim()) {
      updateComment(id, { comment: editedText })
        .then(() => {
          console.log("Comment updated successfully");
          return listComments(goods_id);
        })
        .then((response) => {
          const sortedComments = response.data.reverse();
          setCommentsList(sortedComments);
          setEditCommentId(null);
          setEditedText("");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleDelete = (id) => {
    deleteComment(id)
      .then((response) => {
        console.log("Comment deleted successfully:", response.data);
        return listComments(goods_id);
      })
      .then((response) => {
        const sortedComments = response.data.reverse();
        setCommentsList(sortedComments);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleLike = (id) => {
    getLike(id, member_id)
      .then((response) => {
        if (response.data === 1) {
          // response.data가 1이면 하트 색칠
          setLikedComments((prev) => new Set(prev.add(id)));
        } else {
          setLikedComments((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });
        }
        return listComments(goods_id);
      })
      .then((response) => {
        const sortedComments = response.data.reverse();
        setCommentsList(sortedComments);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // useEffect(()=>{
  //     commentsList.map((comment)=>{
  //         console.log(comment.id)
  //         getLike(comment.id, member_id)
  //             .then((response)=>{
  //                 if (response.data === 1) { // response.data가 1이면 하트 색칠
  //                     setLikedComments(prev => new Set(prev.add(comment.id)));
  //                 }
  //                 return listComments(goods_id);
  //             })
  //             .then((response) => {
  //                 const sortedComments = response.data.reverse();
  //                 setCommentsList(sortedComments);
  //             })
  //             .catch((error) => {
  //                 console.error(error);
  //             });
  //     })
  // },[])

  return (
    <div className="comments-section">
      <div className="comments-list">
        {commentsList.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar">
              <img src="https://via.placeholder.com/40" alt="User Avatar" />
            </div>
            <div className="comment-content">
              <span className="comment-date">
                {comment.modifiedDate == null
                  ? `작성일: ${new Date(comment.createdDate).toLocaleString()}`
                  : `수정일: ${new Date(
                      comment.modifiedDate
                    ).toLocaleString()}`}
              </span>
              <div className="comment-actions">
                {member_id === comment.member.id && (
                  <>
                    <button
                      onClick={() =>
                        handleEditClick(comment.id, comment.comment)
                      }
                    >
                      수정
                    </button>
                    <button onClick={() => handleDelete(comment.id)}>
                      삭제
                    </button>
                  </>
                )}
              </div>
              <div className="comment-username">
                {comment.member.name} {comment.member.age}살{" "}
                {comment.member.gender}자
              </div>
              {editCommentId === comment.id ? (
                <div>
                  <input
                    type="text"
                    value={editedText}
                    onChange={handleEditChange}
                    className="comment-input"
                  />
                  <div className="update-actions">
                    <button onClick={() => handleUpdate(comment.id)}>
                      저장
                    </button>
                    <button onClick={() => setEditCommentId(null)}>취소</button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`like-box ${
                      likedComments.has(comment.id) ? "liked" : ""
                    }`}
                    onClick={() => handleLike(comment.id)}
                  >
                    <FaRegHeart /> {comment.like}
                  </div>
                  <div className="comment-text">
                    <FaRegComment /> {comment.comment}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {member_id != null ? ( // 로그인하면 댓글 등록 가능
        <div className="comment-form">
          <input
            type="text"
            onChange={handleChange}
            className="comment-input"
            value={comment}
            placeholder="댓글을 입력하세요..."
          />
          <button
            type="submit"
            className="comment-submit-btn"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Comments;
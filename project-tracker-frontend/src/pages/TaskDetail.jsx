import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
  Button,
  Divider,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedInUserId = 6;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  const [attachments, setAttachments] = useState([]);

  /* ===== CONFIRM DIALOG ===== */
  const [confirm, setConfirm] = useState({
    open: false,
    type: "", // "task" | "comment" | "attachment"
    id: null
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  /* ================= TASK ================= */

  const fetchTask = useCallback(async () => {
    try {
      const res = await api.get(`/api/v1/task/${id}`);
      setTask(res.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* ================= COMMENTS ================= */

  const fetchComments = async () => {
    const res = await api.get(`/api/v1/comment/task/${id}`);
    setComments(res.data);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    await api.post("/api/v1/comment", {
      task_id: Number(id),
      user_id: loggedInUserId,
      content: newComment
    });

    setNewComment("");
    fetchComments();
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditedComment(comment.content);
  };

  const saveEditedComment = async (commentId) => {
    await api.put(`/api/v1/comment/${commentId}`, {
      content: editedComment
    });

    setEditingCommentId(null);
    fetchComments();
  };

  /* ================= ATTACHMENTS ================= */

  const fetchAttachments = async () => {
    const res = await api.get(`/api/v1/attachment/task/${id}`);
    setAttachments(res.data);
  };

  const uploadAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("task_id", Number(id));
    formData.append("file", file);

    await api.post("/api/v1/attachment", formData);
    fetchAttachments();
  };

  /* ================= DELETE HANDLER ================= */

  const handleConfirmDelete = async () => {
    try {
      if (confirm.type === "comment") {
        await api.delete(`/api/v1/comment/${confirm.id}`);
        fetchComments();
      }

      if (confirm.type === "attachment") {
        await api.delete(`/api/v1/attachment/${confirm.id}`);
        fetchAttachments();
      }

      if (confirm.type === "task") {
        await api.delete(`/api/v1/task/${id}`);
        navigate(-1); // back to previous page
      }

      setSnack({
        open: true,
        message: "Deleted successfully",
        severity: "success"
      });
    } catch {
      setSnack({
        open: true,
        message: "Delete failed",
        severity: "error"
      });
    } finally {
      setConfirm({ open: false, type: "", id: null });
    }
  };

  useEffect(() => {
    fetchTask();
    fetchComments();
    fetchAttachments();
  }, [fetchTask]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          {/* ===== HEADER ===== */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4">{task.task_title}</Typography>

            <Button
              color="error"
              variant="outlined"
              onClick={() =>
                setConfirm({
                  open: true,
                  type: "task",
                  id
                })
              }
            >
              Delete Task
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* ===== COMMENTS ===== */}
          <Typography variant="h6">Comments</Typography>

          {comments.map((c) => (
            <Paper key={c.comment_id} sx={{ p: 1.5, my: 1 }}>
              {editingCommentId === c.comment_id ? (
                <>
                  <TextField
                    fullWidth
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                  <Button onClick={() => saveEditedComment(c.comment_id)}>
                    Save
                  </Button>
                </>
              ) : (
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{c.content}</Typography>
                  <Stack direction="row">
                    <IconButton onClick={() => startEditComment(c)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setConfirm({
                          open: true,
                          type: "comment",
                          id: c.comment_id
                        })
                      }
                    >
                      🗑️
                    </IconButton>
                  </Stack>
                </Stack>
              )}
            </Paper>
          ))}

          <TextField
            fullWidth
            placeholder="Add comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={addComment} variant="contained" sx={{ mt: 1 }}>
            Add Comment
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* ===== ATTACHMENTS ===== */}
          <Typography variant="h6">Attachments</Typography>

          {attachments.map((a) => (
            <Paper
              key={a.attachment_id}
              sx={{ p: 1.5, my: 1, display: "flex", justifyContent: "space-between" }}
            >
              <a href={a.file_url} target="_blank" rel="noreferrer">
                {a.file_name}
              </a>
              <Button
                color="error"
                onClick={() =>
                  setConfirm({
                    open: true,
                    type: "attachment",
                    id: a.attachment_id
                  })
                }
              >
                Delete
              </Button>
            </Paper>
          ))}

          <Button component="label" variant="outlined">
            Upload File
            <input hidden type="file" onChange={uploadAttachment} />
          </Button>
        </CardContent>
      </Card>

      {/* ===== CONFIRM DIALOG ===== */}
      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {confirm.type}?
            {confirm.type === "task" && " This action cannot be undone."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false })}>
            Cancel
          </Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskDetail;

import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Button,
  MenuItem,
  Select,
  TextField,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskDetail = () => {
  const { id: taskId} = useParams();
  const navigate = useNavigate();
  const loggedInUserId = 6; // TEMP (later auth se aayega)

  const [task, setTask] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [assignee, setAssignee] = useState("");

  /* ===== COMMENTS ===== */
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  /* ===== ATTACHMENTS ===== */
  const [attachments, setAttachments] = useState([]);

  /* ===== CONFIRM DELETE ===== */
  const [confirm, setConfirm] = useState({
    open: false,
    type: "",
    id: null
  });

  /* ================= TASK ================= */
  const fetchTask = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/task/${taskId}`
    );
    setTask(res.data);
    setAssignee(res.data.assignee_id || "");
  };

  /* ================= PROJECT MEMBERS ================= */
 const fetchProjectMembers = async (projectId, teamId, deptId) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/department/${deptId}/team/${teamId}/project/${projectId}/members`
    );
    setProjectMembers(res.data);
  } catch (err) {
    console.error("Error fetching members", err);
  }
};

  /* ================= ASSIGNEE ================= */
  const handleAssigneeChange = async (e) => {
    const newAssignee = e.target.value;
    setAssignee(newAssignee);

    await axios.patch(
      `http://127.0.0.1:8000/api/v1/task/${taskId}`,
      { assignee_id: newAssignee }
    );
  };

  /* ================= COMMENTS ================= */
  const fetchComments = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/comment/task/${taskId}`
    );
    setComments(res.data);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    await axios.post("http://127.0.0.1:8000/api/v1/comment", {
      task_id: Number(taskId),
      user_id: loggedInUserId,
      content: newComment
    });

    setNewComment("");
    fetchComments();
  };

  const saveEditedComment = async (commentId) => {
    await axios.put(
      `http://127.0.0.1:8000/api/v1/comment/${commentId}`,
      { content: editedComment }
    );
    setEditingCommentId(null);
    fetchComments();
  };

  /* ================= ATTACHMENTS ================= */
  const fetchAttachments = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/attachment/task/${taskId}`
    );
    setAttachments(res.data);
  };

  const uploadAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("task_id", Number(taskId));
    formData.append("file", file);

    await axios.post(
      "http://127.0.0.1:8000/api/v1/attachment",
      formData
    );
    fetchAttachments();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (confirm.type === "task") {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/task/${taskId}`
      );
      navigate(-1);
    }

    if (confirm.type === "comment") {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/comment/${confirm.id}`
      );
      fetchComments();
    }

    if (confirm.type === "attachment") {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/attachment/${confirm.id}`
      );
      fetchAttachments();
    }

    setConfirm({ open: false, type: "", id: null });
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchTask();
    fetchComments();
    fetchAttachments();
  }, [taskId]);

  useEffect(() => {
  if (task?.project_id && task?.team_id && task?.department_id) {
    fetchProjectMembers(
      task.project_id,
      task.team_id,
      task.department_id
    );
  }
}, [task]);


  if (!task) return <Typography>Loading...</Typography>;

  return (
    <Card>
      <CardContent>
        <Box display="flex" gap={3}>
          {/* ================= LEFT ================= */}
          <Box flex={7}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">{task.task_title}</Typography>
              <Button
                color="error"
                onClick={() =>
                  setConfirm({ open: true, type: "task" })
                }
              >
                Delete
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6">Description</Typography>
            <Typography>{task.task_description || "No description"}</Typography>

            <Divider sx={{ my: 3 }} />

            {/* ===== COMMENTS ===== */}
            <Typography variant="h6">Comments</Typography>

            {comments.map((c) => (
              <Paper key={c.comment_id} sx={{ p: 1, my: 1 }}>
                {editingCommentId === c.comment_id ? (
                  <>
                    <TextField
                      fullWidth
                      value={editedComment}
                      onChange={(e) =>
                        setEditedComment(e.target.value)
                      }
                    />
                    <Button
                      onClick={() => saveEditedComment(c.comment_id)}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{c.content}</Typography>
                    <Stack direction="row">
                      <IconButton
                        onClick={() => {
                          setEditingCommentId(c.comment_id);
                          setEditedComment(c.content);
                        }}
                      >
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
              sx={{ mt: 1 }}
            />
            <Button onClick={addComment} sx={{ mt: 1 }}>
              Add Comment
            </Button>

            <Divider sx={{ my: 3 }} />

            {/* ===== ATTACHMENTS ===== */}
            <Typography variant="h6">Attachments</Typography>

            {attachments.map((a) => (
              <Paper
                key={a.attachment_id}
                sx={{
                  p: 1,
                  my: 1,
                  display: "flex",
                  justifyContent: "space-between"
                }}
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
          </Box>

          {/* ================= RIGHT ================= */}
          <Box flex={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Details</Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="body2">Assignee</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={assignee}
                  onChange={handleAssigneeChange}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {projectMembers.map((m) => (
                    <MenuItem key={m.user_id} value={m.user_id}>
                      {m.user_name}
                    </MenuItem>
                  ))}
                </Select>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </CardContent>

      {/* ===== CONFIRM DIALOG ===== */}
      <Dialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this {confirm.type}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false })}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TaskDetail;
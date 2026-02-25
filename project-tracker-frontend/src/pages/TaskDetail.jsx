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
import api from "../services/api";

const TaskDetail = () => {
  const { deptId, teamId, projectId, taskId } = useParams();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const isProjectManager = role === "PROJECT MANAGER";
  const isContributor = role === "CONTRIBUTOR";

  const loggedInUserId = Number(localStorage.getItem("user_id"));

  const [task, setTask] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [assignee, setAssignee] = useState("");

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  const [attachments, setAttachments] = useState([]);

  const [confirm, setConfirm] = useState({
    open: false,
    type: "",
    id: null
  });

  /* ================= FETCH TASK ================= */
  const fetchTask = async () => {
    if (!taskId) return;

    try {
      const res = await api.get(`/api/v1/task/${Number(taskId)}`);
      setTask(res.data);
      setAssignee(res.data.assignee_id || "");
    } catch (err) {
      console.error("Task fetch error:", err.response?.data);
    }
  };

  /* ================= FETCH MEMBERS ================= */
  const fetchProjectMembers = async () => {
  console.log("Task:", task);
console.log("Members:", projectMembers);
console.log(assignee)
    if (!task?.project_id || !task?.team_id || !task?.department_id) return;

    try {
      const res = await api.get(
        `/api/v1/department/${task.department_id}/team/${task.team_id}/project/${task.project_id}/members`
      );
      setProjectMembers(res.data);
    } catch (err) {
      console.error("Members error:", err);
    }
  };

  /* ================= ASSIGNEE ================= */
  const handleAssigneeChange = async (e) => {
  let newAssignee = e.target.value;

  // Convert empty string to null
  if (newAssignee === "") {
    newAssignee = null;
  } else {
    newAssignee = Number(newAssignee);
  }

  setAssignee(newAssignee ?? "");

  await api.put(`/api/v1/task/${taskId}`, {
    assignee_id: newAssignee
  });
};
  /* ================= COMMENTS ================= */
  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/v1/comment/task/${Number(taskId)}`);
      setComments(res.data);
    } catch (err) {
      console.error("Comments error:", err.response?.data);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    await api.post(`/api/v1/comment`, {
      task_id: Number(taskId),
      user_id: loggedInUserId,
      content: newComment
    });

    setNewComment("");
    fetchComments();
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
    try {
      const res = await api.get(`/api/v1/attachment/task/${Number(taskId)}`);
      setAttachments(res.data);
    } catch (err) {
      console.error("Attachment error:", err.response?.data);
    }
  };

  const uploadAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("task_id", Number(taskId));
    formData.append("file", file);

    await api.post(`/api/v1/attachment`, formData);
    fetchAttachments();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (confirm.type === "task" && isProjectManager) {
      await api.delete(`/api/v1/task/${taskId}`);
      navigate(-1);
    }

    if (confirm.type === "comment") {
      await api.delete(`/api/v1/comment/${confirm.id}`);
      fetchComments();
    }

    if (confirm.type === "attachment" && isProjectManager) {
      await api.delete(`/api/v1/attachment/${confirm.id}`);
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
    fetchProjectMembers();
  }, [task]);

  if (!task) return <Typography>Loading...</Typography>;

  return (
    <Card>
      <CardContent>
        <Box display="flex" gap={3}>
          {/* LEFT SIDE */}
          <Box flex={7}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">{task.task_title}</Typography>

              {isProjectManager && (
                <Button
                  color="error"
                  onClick={() =>
                    setConfirm({ open: true, type: "task" })
                  }
                >
                  Delete
                </Button>
              )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6">Description</Typography>
            <Typography>
              {task.task_description || "No description"}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* COMMENTS */}
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
                      onClick={() =>
                        saveEditedComment(c.comment_id)
                      }
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography>{c.content}</Typography>

                    {c.user_id === loggedInUserId && (
                      <Stack direction="row">
                        <IconButton
                          onClick={() => {
                            setEditingCommentId(
                              c.comment_id
                            );
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
                    )}
                  </Stack>
                )}
              </Paper>
            ))}

            <TextField
              fullWidth
              placeholder="Add comment..."
              value={newComment}
              onChange={(e) =>
                setNewComment(e.target.value)
              }
              sx={{ mt: 1 }}
            />
            <Button onClick={addComment} sx={{ mt: 1 }}>
              Add Comment
            </Button>

            <Divider sx={{ my: 3 }} />

            {/* ATTACHMENTS */}
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
                <a
                  href={a.file_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {a.file_name}
                </a>

                {isProjectManager && (
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
                )}
              </Paper>
            ))}

            <Button component="label" variant="outlined">
              Upload File
              <input
                hidden
                type="file"
                onChange={uploadAttachment}
              />
            </Button>
          </Box>

          {/* RIGHT SIDE */}
          <Box flex={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Details</Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="body2">
                  Assignee
                </Typography>

                {isProjectManager ? (
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
                      <MenuItem
                        key={m.user_id}
                        value={m.user_id}
                      >
                        {m.user_name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Typography sx={{ mt: 1 }}>
 {task.assignee_name || "Unassigned"}
</Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </CardContent>

      <Dialog
        open={confirm.open}
        onClose={() =>
          setConfirm({ open: false, type: "", id: null })
        }
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this{" "}
          {confirm.type}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirm({
                open: false,
                type: "",
                id: null
              })
            }
          >
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
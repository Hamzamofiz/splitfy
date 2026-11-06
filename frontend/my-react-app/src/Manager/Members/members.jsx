import ApiPage from "../../components/ApiPage";
import useRoomData from "../../hooks/useRoomData";

export default function Members({ user }) {
  const { room, loading, error } = useRoomData(user?._id);

  return (
    <ApiPage
      title="Room members"
      description="Members and invite code returned by your room record."
      loading={loading}
      error={error}
    >
      {room ? (
        <section className="api-card">
          <h2>{room.roomName}</h2>
          <p className="api-muted">Invite code: <strong>{room.inviteCode}</strong></p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr>
              </thead>
              <tbody>
                {(room.members || []).map((member) => (
                  <tr key={member._id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone || "—"}</td>
                    <td>{member.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : !loading && !error && (
        <p className="api-message">Create a room from the dashboard before viewing members.</p>
      )}
    </ApiPage>
  );
}

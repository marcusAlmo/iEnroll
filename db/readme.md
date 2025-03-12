<h1>This branch houses the schema and stored procedures for the business logic.</h1>

<style>
table {
    border-collapse: collapse;
    width: 100%;
}

th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

tr:hover {
    background-color: #f5f5f5;
}
</style>

<h2>Tables</h2>

<table>
    <tr>
        <th>Schema</th>
        <th>Table</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>system</td>
        <td>academic_level</td>
        <td>Stores academic levels with codes and support status. Contains academic_level_code, academic_level, is_supported fields.</td>
    </tr>
    <tr>
        <td>system</td>
        <td>grade_level</td>
        <td>Stores grade levels linked to academic levels. Contains grade_level_code, academic_level_code, grade_level, is_supported fields.</td>
    </tr>
    <tr>
        <td>system</td>
        <td>system_setting</td>
        <td>Stores system configuration settings with current and default values. Contains setting_name, current_value, default_value fields.</td>
    </tr>
    <tr>
        <td>system</td>
        <td>system_log</td>
        <td>Logs system actions and events. Contains initiator, action, details, log_datetime fields.</td>
    </tr>
    <tr>
        <td>chat</td>
        <td>conversation</td>
        <td>Stores chat conversations between users. Contains conversation_id, user_id_1, user_id_2, creation_datetime fields.</td>
    </tr>
    <tr>
        <td>chat</td>
        <td>message</td>
        <td>Stores individual chat messages. Contains message_id, conversation_id, sender_id, content, is_read, creation_datetime fields.</td>
    </tr>
    <tr>
        <td>metrics</td>
        <td>consumption_data</td>
        <td>Tracks system resource usage. Contains school_id, date, slot_used, upload_count, download_count fields.</td>
    </tr>
    <tr>
        <td>metrics</td>
        <td>enrollment_data</td>
        <td>Stores enrollment statistics. Contains school_id, date, application_count, accepted/denied/invalid counts.</td>
    </tr>
    <tr>
        <td>metrics</td>
        <td>performance_data</td>
        <td>Tracks system performance metrics. Contains school_id, date, application_received/reviewed/declined/invalid counts.</td>
    </tr>
</table>

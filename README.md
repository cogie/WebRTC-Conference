##WebRTC conferencing using Agora SDK's RTC and RTM 

#System Requirements
    * Agora Signaling SDK
    * You could also change the APP_ID from your own Agora account

#To run the program
    * You can use VScode live server

## Stream monitoring
**Functionality**

Handles incoming events related to video streams. It utilizes socket.io for communication and interacts with a central API (exmapi) to manage streams for multiple stream viewers.

**Event Listener**

The code establishes an event listener for the "in-event" event emitted by the exm library. This listener receives data about the event, including the event name (eventName), args (data), and the socket object (socket).

**Event Processing**

1.  **Event Validation:** The listener checks for the presence of a metadata property within the args object. If missing, it logs an error and exits.
2.  **Data Extraction:** The code extracts relevant information from the metadata object:

-   streamType: Indicates the type of event (e.g., "streamList", "streamAdded", "streamRemoved", "streamUpdate")
-   newStreams: An array of new stream IDs received by the viewer.
-   streamName: Name of the stream associated with the event.

4.  **Stream Management:**

-   A mutex (mutual exclusion) ensures thread safety when updating the streamList. This map stores the currently active streams for each viewer identified by their socket ID.
-   A temporary tempStreamList is created to hold the updated state based on the event type.
-   The switch statement handles different event types and updates tempStreamList accordingly:

-   "streamList": Sets the entire stream list for the viewer's socket ID.
-   "streamAdded": Adds a new stream name to the viewer's stream list if it doesn't already exist.
-   "streamRemoved": Removes streams from the viewer's list that are no longer present in newStreams.
-   "streamUpdate": Replaces the viewer's entire stream list with newStreams.

6.  **Change Detection:**

-   The code iterates through tempStreamList and compares it with previousStreamList (which stores the previous stream state) to identify changes.
-   Sets are used (newStreamSet, previousStreamSet) for efficient stream comparisons.
-   addedStreams captures streams that are new for the viewer compared to the previous state.

**Stream Update Notification**

-   If addedStreams has elements, it signifies new streams for the viewer. An object stream_ is constructed containing the viewer's socket ID and addedStreams.
-   The exmapi.sendStreams function is called to update the central API with the viewer's new stream list. The response from the API is stored in result and this will now contain the validated stream.
-   If the API returns an updated stream list, the streamList is updated accordingly, and previousStreamList is overwritten to reflect the current state.
-   Further notifications are sent to onlinePeers using exm.notify to inform them about the viewer's accepted streams using the updated streamList.

**Error Handling**

-   Error logging is throughout the code to capture potential issues during event processing, API calls, and notifications.

![image](https://github.com/cogie/WebRTC-Conference/assets/32855656/e91890c3-0118-4035-b621-47940ee55807)

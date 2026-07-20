"use client";

import { BellDotIcon } from "lucide-react";
import "./student-notification.css";
import { useState } from "react";

export function StudentNotificationItem() {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div
      className="notification-item-container"
      onClick={() => setDetailOpen(!detailOpen)}
    >
      <div className="notification-header">
        <BellDotIcon />
        <p>Notification 1</p>
      </div>

      <div
        className={`notification-details ${
          detailOpen ? "open" : ""
        }`}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Dolore doloribus molestias accusantium maxime voluptatum
        odit ratione.
      </div>
    </div>
  );
}
"use client";

import { useRef, useState } from "react";
import {
  BellDot,
  ChevronDown,
} from "lucide-react";

import "./student-notification.css";

export function StudentNotificationItem() {
  const [open, setOpen] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="notification-item">
      <button
        type="button"
        className="notification-header"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <div className="notification-title">
          <BellDot size={18} />

          <span>Notification 1</span>
        </div>

        <ChevronDown
          size={18}
          className={`notification-arrow ${
            open ? "open" : ""
          }`}
        />
      </button>

      <div
        ref={bodyRef}
        className="notification-body"
        style={{
          maxHeight: open
            ? `${bodyRef.current?.scrollHeight ?? 0}px`
            : "0px",
        }}
      >
        <div className="notification-body-content">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Dolore doloribus molestias accusantium maxime voluptatum
            odit ratione. Lorem ipsum dolor sit amet consectetur
            adipisicing elit.
          </p>
        </div>
      </div>
    </div>
  );
}
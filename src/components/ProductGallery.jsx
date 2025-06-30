
import React, { useState } from "react";

export default function ProductGallery({ images = [] }) {
    const [current, setCurrent] = useState(0);

    if (!images.length) return null;

    return (
        <div style={{ display: "flex" }}>
            <div style={{ marginRight: 10 }}>
                {images.map((img, idx) => (
                    <img
                        key={img}
                        src={img}
                        alt={`gallery-${idx}`}
                        onClick={() => setCurrent(idx)}
                        style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            border: idx === current ? "2px solid #27ae60" : "1px solid #eee",
                            borderRadius: 5,
                            marginBottom: 5,
                            cursor: "pointer"
                        }}
                    />
                ))}
            </div>
            <img
                src={images[current]}
                alt="main"
                style={{
                    width: 340,
                    height: 340,
                    objectFit: "contain",
                    borderRadius: 10,
                    boxShadow: "0 2px 14px #27ae6016"
                }}
            />
        </div>
    );
}

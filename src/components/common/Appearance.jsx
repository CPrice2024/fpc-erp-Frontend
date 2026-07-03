import { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  Monitor,
  Palette,
  Sidebar,
  Type,
  Check,
} from "lucide-react";

import "../../styles/Appearance.css";

export default function Appearance() {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [sidebar, setSidebar] = useState(
    localStorage.getItem("sidebar") || "expanded"
  );

  const [fontSize, setFontSize] = useState(
    localStorage.getItem("fontSize") || "medium"
  );

  const [accent, setAccent] = useState(
    localStorage.getItem("accent") || "#2563eb"
  );

  useEffect(() => {

    document.body.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);

  }, [theme]);

  useEffect(() => {

    localStorage.setItem(
      "sidebar",
      sidebar
    );

  }, [sidebar]);

  useEffect(() => {

    document.documentElement.style.setProperty(
      "--accent-color",
      accent
    );

    localStorage.setItem(
      "accent",
      accent
    );

  }, [accent]);

  useEffect(() => {

    document.documentElement.style.fontSize =
      fontSize === "small"
        ? "14px"
        : fontSize === "large"
        ? "18px"
        : "16px";

    localStorage.setItem(
      "fontSize",
      fontSize
    );

  }, [fontSize]);

  return (

<div className="appearance-page">

<h1>

Appearance

</h1>

<p>

Customize how the ERP looks.

</p>

{/* Theme */}

<div className="appearance-card">

<h3>

Theme

</h3>

<div className="option-grid">

<button
className={theme==="light"?"active":""}
onClick={()=>setTheme("light")}
>

<Sun/>

Light

</button>

<button
className={theme==="dark"?"active":""}
onClick={()=>setTheme("dark")}
>

<Moon/>

Dark

</button>

<button
className={theme==="system"?"active":""}
onClick={()=>setTheme("system")}
>

<Monitor/>

System

</button>

</div>

</div>

{/* Sidebar */}

<div className="appearance-card">

<h3>

Sidebar

</h3>

<div className="option-grid">

<button
className={sidebar==="expanded"?"active":""}
onClick={()=>setSidebar("expanded")}
>

<Sidebar/>

Expanded

</button>

<button
className={sidebar==="compact"?"active":""}
onClick={()=>setSidebar("compact")}
>

<Sidebar/>

Compact

</button>

</div>

</div>

{/* Font */}

<div className="appearance-card">

<h3>

Font Size

</h3>

<select

value={fontSize}

onChange={(e)=>
setFontSize(
e.target.value
)
}

>

<option value="small">

Small

</option>

<option value="medium">

Medium

</option>

<option value="large">

Large

</option>

</select>

</div>

{/* Accent */}

<div className="appearance-card">

<h3>

Accent Color

</h3>

<div className="color-picker">

{

[
"#2563eb",
"#16a34a",
"#9333ea",
"#dc2626",
"#ea580c",
"#0891b2",
]

.map(color=>(

<div

key={color}

className="color-circle"

style={{
background:color
}}

onClick={()=>
setAccent(color)
}

>

{

accent===color&&
<Check
size={18}
color="white"
/>

}

</div>

))

}

</div>

</div>

</div>

);

}
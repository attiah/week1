<%@ WebHandler Language="C#" Class="lect" %>

using System;
using System.Web;
using System.Data;
public class lect : IHttpHandler
{
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string id = (context.Request["id"] != null) ? context.Request["id"] : "";
        Dbclass db = new Dbclass();
        string s = "Select * From LectureData where Student_ID='" + id + "' and LectureState=1";
        DataTable dt = db.getTable(s);
        s = "data";
        for(int x=0;x<dt.Rows.Count;x++)
        {
            s+= ";"+dt.Rows[x]["SectionID"].ToString ();
            s += "," + dt.Rows[x]["Course_ID"].ToString();
            s += "," + dt.Rows[x]["Name_of_course"].ToString();
            s += "," + dt.Rows[x]["Fname"].ToString();
            s += "," + dt.Rows[x]["Lname"].ToString();
            s += "," + dt.Rows[x]["LectureID"].ToString();
            s += "," + dt.Rows[x]["n"].ToString();
            s += "," + dt.Rows[x]["e"].ToString();
        }
        context.Response.Write(s);
    }
   
    public bool IsReusable {
        get {
            return false;
        }
    }

}
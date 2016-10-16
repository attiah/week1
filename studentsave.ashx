<%@ WebHandler Language="C#" Class="studentsave" %>

using System;
using System.Web;
using System.Data;
public class studentsave : IHttpHandler
{
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string id = (context.Request["id"] != null) ? context.Request["id"] : "";
        string lid = (context.Request["lid"] != null) ? context.Request["lid"] : "";
        string n = (context.Request["n"] != null) ? context.Request["n"] : "";
        string e = (context.Request["e"] != null) ? context.Request["e"] : "";
        string sfile = (context.Request["sfile"] != null) ? context.Request["sfile"] : "";
        Dbclass db = new Dbclass();
        string s = "Select * From StudentLecture where Student_ID='" + id + "' and LectureID='" + lid + "'";
        DataTable dt = db.getTable(s);
        if (dt != null && dt.Rows.Count > 0)
        {
            s = "Update StudentLecture set studentState=1, ImageName='" + sfile + "' ,sn='" + n + "' , se='" + e + "' where LectureID='" + lid + "' and Student_ID='" + id + "'";
            if (db.Run(s))
            {
                context.Response.Write(" the data is update");
            }
            else
            {
                context.Response.Write(" can not  update data try again");
            }
        }
        else
        {
            s = "insert into  StudentLecture (LectureID,Student_ID,studentState,ImageName,sn,se) values ('"+lid+"','"+id+"',1,'" + sfile + "' ,'" + n + "' , '" + e + "')";
            if (db.Run(s))
            {
                context.Response.Write(" the data is update");
            }
            else
            {
                context.Response.Write(" can not  update data try again");
            }
        }
        
    }
   
    public bool IsReusable {
        get {
            return false;
        }
    }

}
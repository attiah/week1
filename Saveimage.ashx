<%@ WebHandler Language="C#" Class="Saveimage" %>

using System;
using System.Web;
using System.Drawing;
using System.IO;
public class Saveimage : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string file = "";
        try
        {
            string data = (context.Request["data"] != null) ? context.Request["data"] : "";
            string path = context.Server.MapPath("upload");
            string fileName = path + "\\img" + DateTime.Now.Date.ToString("yyyyMMdd")+DateTime.Now.TimeOfDay.Hours+""+DateTime.Now.TimeOfDay.Minutes +""+DateTime.Now.TimeOfDay.Seconds + ".jpeg";
            file = "img" + DateTime.Now.Date.ToString("yyyyMMdd") + DateTime.Now.TimeOfDay.Hours + "" + DateTime.Now.TimeOfDay.Minutes + "" + DateTime.Now.TimeOfDay.Seconds + ".jpeg";
            string[] arr= data.Split(',');
             using (FileStream fs = new FileStream(fileName, FileMode.Create))
            {

                using (BinaryWriter bw = new BinaryWriter(fs))
                {

                    byte[] data1 = Convert.FromBase64String(arr[1]);
                    bw.Write(data1);
                    bw.Close();
                }
            }
        }
        catch (Exception ex)
        {
            //context.Response.Write(ex.ToString ());
        }
        context.Response.Write(file);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;


/// <summary>
/// Summary description for Dbclass
/// </summary>
public class Dbclass
{
    SqlConnection dbconn = new SqlConnection();
    public Dbclass()
    {
        try
        {
            dbconn.ConnectionString = @"Data Source=Fingerprint.mssql.somee.com;Initial Catalog=fingerprint;Persist Security Info=True;User ID=Fingerprint_SQLLogin_1;Password=x2xafqka8q";
            dbconn.Open();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
        //----- run insert, delete and update
        public bool Run(String sql)
        {
            bool done= false;
           try
        {
            SqlCommand cmd = new SqlCommand(sql,dbconn);
            cmd.ExecuteNonQuery();
               done= true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        } 
            return done;
        }
        //----- run insert, delete and update
        public DataTable  getTable(String sql)
        {
            DataTable done = null;
            try
            {
                SqlDataAdapter da = new SqlDataAdapter(sql, dbconn);
                DataSet ds = new DataSet();
                da.Fill(ds);
                return ds.Tables[0];
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return done;
        }
	
}
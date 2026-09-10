using System.Net;
using System.Text.Json;

namespace MercadoExpress.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _requestDelegate;

        public ExceptionMiddleware(RequestDelegate requestDelegate)
        {
            _requestDelegate = requestDelegate;
        }

        public async Task Invoke(HttpContext context) 
        {
            try
            {
                await _requestDelegate(context); // ejecuta el controller/UseCase
            }
            catch(Exception ex) 
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            // Mapeo segun el mensaje o tipo excepcion
            var statusCode = ex switch
            {
                KeyNotFoundException => HttpStatusCode.NotFound, // 404
                ArgumentException => HttpStatusCode.BadRequest, // 400
                InvalidOperationException => HttpStatusCode.BadRequest, // 400
                _ => HttpStatusCode.InternalServerError, // 500 
            };

            context.Response.StatusCode = (int)statusCode;
            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = ex.Message
            };

            var json = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(json);
        }
    }
}

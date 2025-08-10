
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
const app = express();

app.use('/', swaggerUi.serve, swaggerUi.setup(null, {
   explorer: true,
   swaggerOptions: {
    url: 'https://pjjnkwo07d.execute-api.ap-south-1.amazonaws.com/staging/api/api-doc-json',
    scopes: ['openid', 'email', 'phone', 'profile'],
    oauth2RedirectUrl: `http://localhost:4005/api/oauth2-redirect.html`,
    requestInterceptor: (req: Request) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - ui is added by Swagger UI
        const authState = window?.ui?.authSelectors?.authorized?.()?.toJS?.();
        if (authState) {
          const tokens = authState.cognitoAuth?.token;
          if (tokens?.id_token) {
            // @ts-ignore
            req.headers['x-id-token'] = `Bearer ${tokens.id_token}`;
          }
        }
        return req;
    },
   },
}));

app.get('/api/oauth2-redirect.html', (req, res) => {
  res.sendFile(path.join(__dirname, './public/oauth2-redirect.html'));
});
app.listen(4005)
// export const handler = serverless(app);

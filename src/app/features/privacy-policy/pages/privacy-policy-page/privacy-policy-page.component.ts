import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-privacy-policy-page',
  standalone: true,
  imports: [MarkdownModule],
  templateUrl: './privacy-policy-page.component.html',
})
export default class PrivacyPolicyPageComponent {
  text = `
    **Neura Privacy Policy**

    Effective Date: 15/05/2023

    Thank you for using Neura. Your privacy is important to us. This Privacy Policy describes how we collect, use, and protect your information when you use our application.

    ### 1. Information We Collect

    #### a) User Data

    To enhance user experience, we may collect:

    - Basic identification data (name, email, etc.), if the user provides this information.
    - Chat history with the AI assistant.

    #### b) Usage Data

    We collect data on how the application is used, such as usage frequency and interactions with the AI.

    ### 2. Data Storage and Security

    - User chats are stored in our database to improve the experience and provide more accurate responses.
    - We do not guarantee that chats and user data will remain stored indefinitely, as the database infrastructure may change or be affected, potentially resulting in data loss.
    - Communication between the application and our backend is encrypted to ensure the security of transmitted data.

    ### 3. Use of Information

    We use the collected information to:

    - Improve user experience and optimize AI performance.
    - Provide support and resolve technical issues.
    - Analyze application usage for future improvements.

    ### 4. Information Sharing

    Neura does not share or sell user information to third parties. However, we may share data in the following cases:

    - If required by law or court order.
    - To protect the rights, security, and integrity of our application and users.

    ### 5. Contact

    If you have any questions about this privacy policy, you can contact us at: joseperu2503@gmail.com.

 `;
}

import torch
import torch.nn as nn

class CNNBiLSTM(nn.Module):
    def __init__(self, vocab_size, n_classes, emb=128, hid=128):
        super().__init__()
        self.emb = nn.Embedding(vocab_size, emb, padding_idx=0)
        self.convs = nn.ModuleList([nn.Conv1d(emb, 100, k, padding=k // 2) for k in (2, 3, 4)])
        self.lstm = nn.LSTM(emb, hid, batch_first=True, bidirectional=True)
        self.drop = nn.Dropout(0.4)
        self.fc = nn.Linear(100 * 3 + hid * 2, n_classes)

    def forward(self, x):
        e = self.emb(x)                          # B, L, E
        c = e.transpose(1, 2)                     # B, E, L  (for Conv1d)
        cnn = [torch.relu(conv(c)).max(dim=2).values for conv in self.convs]
        cnn = torch.cat(cnn, dim=1)               # phrase features
        out, _ = self.lstm(e)
        lstm = out.mean(dim=1)                    # context features
        z = self.drop(torch.cat([cnn, lstm], dim=1))
        return self.fc(z)